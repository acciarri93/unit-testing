import { TestBed } from "@angular/core/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { HttpTestingController } from "@angular/common/http/testing";
import { HTTP_INTERCEPTORS } from "@angular/common/http";

import { TokenService } from "./token.service";
import { AuthService } from "./auth.service";
import { TokenInterceptor } from "../interceptors/token.interceptor";
import { Auth } from "../models/auth.model";
import { environment } from "src/environments/environment";

describe('AuthService', () => {
  let authService: AuthService;
  let httpController: HttpTestingController;
  let tokenservice: TokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [
        AuthService,
        TokenService,

      ]
    });
    authService = TestBed.inject(AuthService);
    httpController = TestBed.inject(HttpTestingController);
    tokenservice = TestBed.inject(TokenService);
  });

  afterEach(() => {
    httpController.verify();
  });

  it('should be create', () => {
    expect(authService).toBeTruthy();
  });

  describe('test for login', () => {

    it('should return a token', (doneFn) => {

      //Arrange
      const mockData: Auth = {
        access_token: '121212'
      };
      const email = 'acciarri93@gmail.com';
      const password = '1212';
      //Act
      authService.login(email, password)
      .subscribe((data)=> {
        //Assert
        expect(data).toEqual(mockData);
        doneFn();
      });

      // http config
      const url = `${environment.API_URL}/api/v1/auth/login`;
      const req = httpController.expectOne(url);
      req.flush(mockData);

    });


    it('should call to saveToken', (doneFn) => {

      //Arrange
      const mockData: Auth = {
        access_token: '121212'
      };
      const email = 'acciarri93@gmail.com';
      const password = '1212';
      spyOn(tokenservice, 'saveToken').and.callThrough();
      //Act
      authService.login(email, password)
      .subscribe((data)=> {
        //Assert
        expect(data).toEqual(mockData);
        expect(tokenservice.saveToken).toHaveBeenCalledTimes(1);
        expect(tokenservice.saveToken).toHaveBeenCalledOnceWith('121212');
        doneFn();
      });

      // http config
      const url = `${environment.API_URL}/api/v1/auth/login`;
      const req = httpController.expectOne(url);
      req.flush(mockData);

    });


  });


});
