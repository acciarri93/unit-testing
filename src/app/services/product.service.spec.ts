import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ProductsService } from './product.service';
import { Product, UpdateProductDTO } from '../models/product.model';
import { generateManyProducts, generateOneProduct } from '../models/product.mock';
import { environment } from './../../environments/environment';

import { CreateProductDTO } from '../models/product.model';
import { HttpStatusCode, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from '../interceptors/token.interceptor';
import { TokenService } from './token.service';

describe('ProductsService', () => {
  let productService: ProductsService;
  let httpController: HttpTestingController;
  let tokenservice: TokenService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [
        ProductsService,
        TokenService,
        {
          provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true
        }
      ]
    });
    productService = TestBed.inject(ProductsService);
    httpController = TestBed.inject(HttpTestingController);
    tokenservice = TestBed.inject(TokenService);
  });

  afterEach(() => {
    httpController.verify();
  })

  it('should be create', () => {
    expect(productService).toBeTruthy();
  });


  describe('tests for getAllSimple', () => {
    it('should return a product list', (doneFn) => {
      //Arrange
      const mockData: Product[] = generateManyProducts(2);
      spyOn(tokenservice, 'getToken').and.returnValue('123');
      //Act
      productService.getAllSimple()
      .subscribe((data)=> {
        //Assert
        expect(data.length).toEqual(mockData.length);
        expect(data).toEqual(mockData);
        doneFn();
      });

      // http config
      const url = `${environment.API_URL}/api/v1/products`;
      const req = httpController.expectOne(url);
      const headers = req.request.headers;
      expect(headers.get('Authorization')).toEqual(`Bearer 123`);
      req.flush(mockData);

    });
  });


  describe('tests for getAll', () => {

    it('should return a product list', (doneFn) => {
      //Arrange
      const mockData: Product[] = generateManyProducts(3);
      //Act
      productService.getAll()
      .subscribe((data)=> {
        //Assert
        expect(data.length).toEqual(mockData.length);
        doneFn();
      });

      // http config
      const url = `${environment.API_URL}/api/v1/products`;
      const req = httpController.expectOne(url);
      req.flush(mockData);
      httpController.verify();
    });


    it('should return product list with taxes', (doneFn) => {
      // Arrange
      const mockData: Product[] = [
        {
          ...generateOneProduct(),
          price: 100, // 100 * .19 = 19
        },
        {
          ...generateOneProduct(),
          price: 200, // 200 * .19 = 38
        },
        {
          ...generateOneProduct(),
          price: 0,
        },
        {
          ...generateOneProduct(),
          price: -100, // 200 * .19 = 38
        }
      ];
      //Act
      productService.getAll()
      .subscribe((data)=> {
        //Assert
        expect(data.length).toEqual(mockData.length);
        expect(data[0].taxes).toEqual(19);
        expect(data[1].taxes).toEqual(38);
        expect(data[2].taxes).toEqual(0);
        expect(data[3].taxes).toEqual(0);
        doneFn();
      });

      // http config
      const url = `${environment.API_URL}/api/v1/products`;
      const req = httpController.expectOne(url);
      req.flush(mockData); //montaje del mock de datos

    });


    it('should send queryParams with limit 10 and offset 3', (doneFn) => {
      //Arrange
      const mockData: Product[] = generateManyProducts(3);
      const limit = 10;
      const offset = 3;
      //Act
      productService.getAll(limit, offset)
      .subscribe((data)=> {
        //Assert
        expect(data.length).toEqual(mockData.length);
        doneFn();
      });

      // http config
      const url = `${environment.API_URL}/api/v1/products?limit=${limit}&offset=${offset}`;
      const req = httpController.expectOne(url);
      req.flush(mockData);
      const params = req.request.params;
      expect(params.get('limit')).toEqual(`${limit}`);
      expect(params.get('offset')).toEqual(`${offset}`);

    });
  });


  describe('test for create', () => {

      it('should return a new product', (doneFn) => {
        // Arrange
        const mockData = generateOneProduct();
        const dto: CreateProductDTO = {
          title: 'New Product',
          price: 100,
          images: ['img'],
          description: 'bla bla bla',
          categoryId: 12
        }
        // Act
        productService.create({...dto})
        .subscribe(data => {
          // Assert
          expect(data).toEqual(mockData);
          doneFn();
        });

        // http config
      const url = `${environment.API_URL}/api/v1/products`;
      const req = httpController.expectOne(url);
      req.flush(mockData); //montaje del mock de datos
      expect(req.request.body).toEqual(dto); //igualamos el dto con lo que enviamos al backend
      expect(req.request.method).toEqual('POST');
      });


      it('should update a product', (doneFn) => {
        // Arrange
        const mockData = generateOneProduct();
        const dto: UpdateProductDTO = {
          title: 'New Product 2.0'
        }
        const productId = '1';
        // Act
        productService.update(productId, {...dto})
        .subscribe(data => {
          // Assert
          expect(data).toEqual(mockData);
          doneFn();
        });

        // http config
      const url = `${environment.API_URL}/api/v1/products/${productId}`;
      const req = httpController.expectOne(url);
      expect(req.request.body).toEqual(dto); //igualamos el dto con lo que enviamos al backend
      expect(req.request.method).toEqual('PUT');
      req.flush(mockData); //montaje del mock de datos
      });


      it('should delete product', (doneFn) => {
        // Arrange
        const mockData = true;
        const productId = '1';
        // Act
        productService.delete(productId)
        .subscribe(data => {
          // Assert
          expect(data).toEqual(mockData);
          doneFn();
        });

        // http config
      const url = `${environment.API_URL}/api/v1/products/${productId}`;
      const req = httpController.expectOne(url);
      req.flush(mockData); //montaje del mock de datos
      expect(req.request.method).toEqual('DELETE');
      });
    });


  describe('test for getOne', () => {

    it('should return a product', (doneFn) => {
      // Arrange
      const mockData = generateOneProduct();
      const productId = '1';
      // Act
      productService.getOne(productId)
      .subscribe(data => {
        // Assert
        expect(data).toEqual(mockData);
        doneFn();
      });

      // http config
    const url = `${environment.API_URL}/api/v1/products/${productId}`;
    const req = httpController.expectOne(url);
    expect(req.request.method).toEqual('GET');
    req.flush(mockData); //montaje del mock de datos
    });


    it('should return the right msg when code is 404', (doneFn) => {
      // Arrange

      const productId = '1';
      const msgError = '404 msg';
      const mockError = {
        status: HttpStatusCode.NotFound,
        statusText: msgError
      }
      // Act
      productService.getOne(productId)
      .subscribe({
        error: (error) => {
          //assert
          expect(error).toEqual('El producto no existe');
          doneFn();
        }
      })

      // http config
    const url = `${environment.API_URL}/api/v1/products/${productId}`;
    const req = httpController.expectOne(url);
    expect(req.request.method).toEqual('GET');
    req.flush(msgError, mockError); //montaje del mock de datos
    });


  });


});
