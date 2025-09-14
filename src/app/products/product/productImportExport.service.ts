import mongoose from 'mongoose';
import { ProductModel } from './product.model';
import { ColorModel, SizeModel } from '../attribute/attribute.model';
import { CatagoryModel } from '../catagory/catagory.model';
import { TProduct } from './product.interface';
import * as XLSX from 'xlsx';
import * as csv from 'csv-parser';
import { Readable } from 'stream';

export interface ImportResult {
  success: boolean;
  totalRows: number;
  processedRows: number;
  successRows: number;
  errorRows: number;
  errors: Array<{
    row: number;
    error: string;
    data: any;
  }>;
  summary: {
    created: number;
    updated: number;
    skipped: number;
  };
}

export interface ExportOptions {
  format: 'csv' | 'xlsx' | 'json';
  fields?: string[];
  filters?: {
    status?: string[];
    categories?: string[];
    featured?: boolean;
    dateRange?: {
      start: Date;
      end: Date;
    };
  };
  includeVariants?: boolean;
  includeAnalytics?: boolean;
}

export interface ProductExportData {
  id: string;
  title: string;
  description: string;
  shortDescription?: string;
  primaryImage: string;
  optionalImages?: string;
  regularPrice: number;
  discountPrice: number;
  costPrice?: number;
  sku: string;
  barcode?: string;
  weight?: number;
  dimensions?: string;
  status: string;
  featured: boolean;
  tags?: string;
  categories: string;
  colors: string;
  sizes: string;
  totalStock: number;
  availableStock: number;
  lowStockThreshold: number;
  trackInventory: boolean;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  slug: string;
  views: number;
  purchases: number;
  averageRating: number;
  totalReviews: number;
  wishlistCount: number;
  createdAt: string;
  updatedAt: string;
}

export class ProductImportExportService {
  /**
   * Import products from CSV file
   */
  static async importFromCSV(fileBuffer: Buffer): Promise<ImportResult> {
    const results: ImportResult = {
      success: true,
      totalRows: 0,
      processedRows: 0,
      successRows: 0,
      errorRows: 0,
      errors: [],
      summary: {
        created: 0,
        updated: 0,
        skipped: 0
      }
    };

    try {
      const csvData: any[] = [];
      const stream = Readable.from(fileBuffer);
      
      await new Promise((resolve, reject) => {
        stream
          .pipe(csv())
          .on('data', (row) => csvData.push(row))
          .on('end', resolve)
          .on('error', reject);
      });

      results.totalRows = csvData.length;

      for (let i = 0; i < csvData.length; i++) {
        const row = csvData[i];
        results.processedRows++;

        try {
          const productData = await this.parseProductRow(row, i + 1);
          
          if (productData) {
            const existingProduct = await ProductModel.findOne({ sku: productData.sku });
            
            if (existingProduct) {
              // Update existing product
              await ProductModel.findByIdAndUpdate(existingProduct._id, productData);
              results.summary.updated++;
            } else {
              // Create new product
              await ProductModel.create(productData);
              results.summary.created++;
            }
            
            results.successRows++;
          } else {
            results.summary.skipped++;
          }
        } catch (error) {
          results.errorRows++;
          results.errors.push({
            row: i + 1,
            error: error instanceof Error ? error.message : 'Unknown error',
            data: row
          });
        }
      }

      results.success = results.errorRows === 0;
    } catch (error) {
      results.success = false;
      results.errors.push({
        row: 0,
        error: error instanceof Error ? error.message : 'File processing error',
        data: {}
      });
    }

    return results;
  }

  /**
   * Import products from Excel file
   */
  static async importFromExcel(fileBuffer: Buffer): Promise<ImportResult> {
    const results: ImportResult = {
      success: true,
      totalRows: 0,
      processedRows: 0,
      successRows: 0,
      errorRows: 0,
      errors: [],
      summary: {
        created: 0,
        updated: 0,
        skipped: 0
      }
    };

    try {
      const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      results.totalRows = jsonData.length;

      for (let i = 0; i < jsonData.length; i++) {
        const row = jsonData[i] as any;
        results.processedRows++;

        try {
          const productData = await this.parseProductRow(row, i + 1);
          
          if (productData) {
            const existingProduct = await ProductModel.findOne({ sku: productData.sku });
            
            if (existingProduct) {
              await ProductModel.findByIdAndUpdate(existingProduct._id, productData);
              results.summary.updated++;
            } else {
              await ProductModel.create(productData);
              results.summary.created++;
            }
            
            results.successRows++;
          } else {
            results.summary.skipped++;
          }
        } catch (error) {
          results.errorRows++;
          results.errors.push({
            row: i + 1,
            error: error instanceof Error ? error.message : 'Unknown error',
            data: row
          });
        }
      }

      results.success = results.errorRows === 0;
    } catch (error) {
      results.success = false;
      results.errors.push({
        row: 0,
        error: error instanceof Error ? error.message : 'File processing error',
        data: {}
      });
    }

    return results;
  }

  /**
   * Export products to CSV
   */
  static async exportToCSV(options: ExportOptions = { format: 'csv' }): Promise<Buffer> {
    const products = await this.getProductsForExport(options);
    const csvData = this.formatProductsForCSV(products);
    
    const worksheet = XLSX.utils.json_to_sheet(csvData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Products');
    
    return Buffer.from(XLSX.write(workbook, { type: 'buffer', bookType: 'csv' }));
  }

  /**
   * Export products to Excel
   */
  static async exportToExcel(options: ExportOptions = { format: 'xlsx' }): Promise<Buffer> {
    const products = await this.getProductsForExport(options);
    const excelData = this.formatProductsForExcel(products);
    
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Products');
    
    return Buffer.from(XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' }));
  }

  /**
   * Export products to JSON
   */
  static async exportToJSON(options: ExportOptions = { format: 'json' }): Promise<Buffer> {
    const products = await this.getProductsForExport(options);
    return Buffer.from(JSON.stringify(products, null, 2));
  }

  /**
   * Get template file for import
   */
  static async getImportTemplate(format: 'csv' | 'xlsx'): Promise<Buffer> {
    const templateData = [{
      title: 'Sample Product',
      description: 'This is a sample product description',
      shortDescription: 'Short description',
      primaryImage: 'https://example.com/image.jpg',
      optionalImages: 'https://example.com/image1.jpg,https://example.com/image2.jpg',
      regularPrice: 100,
      discountPrice: 80,
      costPrice: 50,
      sku: 'SAMPLE-001',
      barcode: '1234567890123',
      weight: 1.5,
      dimensions: '10x5x2',
      status: 'active',
      featured: false,
      tags: 'tag1,tag2,tag3',
      categories: 'Category1,Category2',
      colors: 'Red,Blue',
      sizes: 'M,L,XL',
      totalStock: 100,
      lowStockThreshold: 10,
      trackInventory: true,
      seoTitle: 'Sample Product - SEO Title',
      seoDescription: 'SEO description for sample product',
      seoKeywords: 'sample,product,example'
    }];

    if (format === 'csv') {
      const worksheet = XLSX.utils.json_to_sheet(templateData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Template');
      return Buffer.from(XLSX.write(workbook, { type: 'buffer', bookType: 'csv' }));
    } else {
      const worksheet = XLSX.utils.json_to_sheet(templateData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Template');
      return Buffer.from(XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' }));
    }
  }

  /**
   * Parse a single product row from import data
   */
  private static async parseProductRow(row: any, rowNumber: number): Promise<Partial<TProduct> | null> {
    try {
      // Skip empty rows
      if (!row.title || !row.sku) {
        return null;
      }

      // Parse categories
      const categoryNames = row.categories ? row.categories.split(',').map((c: string) => c.trim()) : [];
      const categories = await this.getCategoryIds(categoryNames);

      // Parse colors
      const colorNames = row.colors ? row.colors.split(',').map((c: string) => c.trim()) : [];
      const colors = await this.getColorIds(colorNames);

      // Parse sizes
      const sizeNames = row.sizes ? row.sizes.split(',').map((s: string) => s.trim()) : [];
      const sizes = await this.getSizeIds(sizeNames);

      // Parse dimensions
      let dimensions;
      if (row.dimensions) {
        const dims = row.dimensions.split('x').map((d: string) => parseFloat(d.trim()));
        if (dims.length === 3) {
          dimensions = {
            length: dims[0],
            width: dims[1],
            height: dims[2],
            unit: 'cm' as const
          };
        }
      }

      // Parse optional images
      const optionalImages = row.optionalImages 
        ? row.optionalImages.split(',').map((img: string) => img.trim())
        : [];

      // Parse tags
      const tags = row.tags ? row.tags.split(',').map((t: string) => t.trim()) : [];

      const productData: Partial<TProduct> = {
        title: row.title,
        description: row.description || '',
        shortDescription: row.shortDescription,
        primaryImage: row.primaryImage || '',
        optionalImages: optionalImages.length > 0 ? optionalImages : undefined,
        regularPrice: parseFloat(row.regularPrice) || 0,
        discountPrice: parseFloat(row.discountPrice) || 0,
        costPrice: row.costPrice ? parseFloat(row.costPrice) : undefined,
        sku: row.sku,
        barcode: row.barcode,
        weight: row.weight ? parseFloat(row.weight) : undefined,
        dimensions,
        catagory: categories,
        color: colors,
        size: sizes,
        inventory: {
          totalStock: parseInt(row.totalStock) || 0,
          reservedStock: 0,
          availableStock: parseInt(row.totalStock) || 0,
          lowStockThreshold: parseInt(row.lowStockThreshold) || 10,
          trackInventory: row.trackInventory === 'true' || row.trackInventory === true
        },
        status: row.status || 'active',
        featured: row.featured === 'true' || row.featured === true,
        tags: tags.length > 0 ? tags : undefined,
        seo: {
          metaTitle: row.seoTitle,
          metaDescription: row.seoDescription,
          metaKeywords: row.seoKeywords ? row.seoKeywords.split(',').map((k: string) => k.trim()) : undefined,
          slug: this.generateSlug(row.title)
        },
        analytics: {
          views: 0,
          purchases: 0,
          wishlistCount: 0,
          averageRating: 0,
          totalReviews: 0
        }
      };

      return productData;
    } catch (error) {
      throw new Error(`Row ${rowNumber}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get products for export based on options
   */
  private static async getProductsForExport(options: ExportOptions): Promise<any[]> {
    const matchStage: any = {};

    if (options.filters) {
      if (options.filters.status) {
        matchStage.status = { $in: options.filters.status };
      }
      if (options.filters.categories) {
        matchStage.catagory = { $in: options.filters.categories.map(id => new mongoose.Types.ObjectId(id)) };
      }
      if (options.filters.featured !== undefined) {
        matchStage.featured = options.filters.featured;
      }
      if (options.filters.dateRange) {
        matchStage.createdAt = {
          $gte: options.filters.dateRange.start,
          $lte: options.filters.dateRange.end
        };
      }
    }

    const pipeline = [
      { $match: matchStage },
      {
        $lookup: {
          from: 'catagories',
          localField: 'catagory',
          foreignField: '_id',
          as: 'categories'
        }
      },
      {
        $lookup: {
          from: 'colors',
          localField: 'color',
          foreignField: '_id',
          as: 'colors'
        }
      },
      {
        $lookup: {
          from: 'sizes',
          localField: 'size',
          foreignField: '_id',
          as: 'sizes'
        }
      },
      {
        $project: {
          id: '$_id',
          title: 1,
          description: 1,
          shortDescription: 1,
          primaryImage: 1,
          optionalImages: 1,
          regularPrice: 1,
          discountPrice: 1,
          costPrice: 1,
          sku: 1,
          barcode: 1,
          weight: 1,
          dimensions: 1,
          status: 1,
          featured: 1,
          tags: 1,
          categories: { $map: { input: '$categories', as: 'cat', in: '$$cat.title' } },
          colors: { $map: { input: '$colors', as: 'color', in: '$$color.name' } },
          sizes: { $map: { input: '$sizes', as: 'size', in: '$$size.size' } },
          totalStock: '$inventory.totalStock',
          availableStock: '$inventory.availableStock',
          lowStockThreshold: '$inventory.lowStockThreshold',
          trackInventory: '$inventory.trackInventory',
          seoTitle: '$seo.metaTitle',
          seoDescription: '$seo.metaDescription',
          seoKeywords: '$seo.metaKeywords',
          slug: '$seo.slug',
          views: '$analytics.views',
          purchases: '$analytics.purchases',
          averageRating: '$analytics.averageRating',
          totalReviews: '$analytics.totalReviews',
          wishlistCount: '$analytics.wishlistCount',
          createdAt: 1,
          updatedAt: 1
        }
      }
    ];

    return await ProductModel.aggregate(pipeline);
  }

  /**
   * Format products for CSV export
   */
  private static formatProductsForCSV(products: any[]): any[] {
    return products.map(product => ({
      ...product,
      optionalImages: product.optionalImages ? product.optionalImages.join(',') : '',
      tags: product.tags ? product.tags.join(',') : '',
      categories: product.categories.join(','),
      colors: product.colors.join(','),
      sizes: product.sizes.join(','),
      dimensions: product.dimensions ? `${product.dimensions.length}x${product.dimensions.width}x${product.dimensions.height}` : '',
      seoKeywords: product.seoKeywords ? product.seoKeywords.join(',') : '',
      createdAt: product.createdAt ? new Date(product.createdAt).toISOString() : '',
      updatedAt: product.updatedAt ? new Date(product.updatedAt).toISOString() : ''
    }));
  }

  /**
   * Format products for Excel export
   */
  private static formatProductsForExcel(products: any[]): any[] {
    return this.formatProductsForCSV(products);
  }

  /**
   * Get category IDs by names
   */
  private static async getCategoryIds(names: string[]): Promise<mongoose.Types.ObjectId[]> {
    if (names.length === 0) return [];
    
    const categories = await CatagoryModel.find({ title: { $in: names } });
    return categories.map(cat => cat._id);
  }

  /**
   * Get color IDs by names
   */
  private static async getColorIds(names: string[]): Promise<mongoose.Types.ObjectId[]> {
    if (names.length === 0) return [];
    
    const colors = await ColorModel.find({ name: { $in: names } });
    return colors.map(color => color._id);
  }

  /**
   * Get size IDs by values
   */
  private static async getSizeIds(values: string[]): Promise<mongoose.Types.ObjectId[]> {
    if (values.length === 0) return [];
    
    const sizes = await SizeModel.find({ size: { $in: values } });
    return sizes.map(size => size._id);
  }

  /**
   * Generate slug from title
   */
  private static generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
}
