import { TestBed } from '@angular/core/testing';

import { MapsService } from './maps.service';

fdescribe('MapsService', () => {
  let service: MapsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MapsService]
    });
    service = TestBed.inject(MapsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('test for getCurrentPostition', () => {
    it('should save the center', () => {
      //Arrange
      spyOn(navigator.geolocation, 'getCurrentPosition').and.callFake((succesFn) => {
        const mockGeolocation = {
          coords: {
            accuracy: 0,
            altitude: 0,
            altitudeAccuracy: 0,
            heading: 0,
            latitude: 1000,
            longitude: 2000,
            speed: 0
          },
          timestamp: 0,
        };
        succesFn(mockGeolocation);
      });
      // Act
      service.getCurrentPosition();
      // Assert
      expect(service.center.lat).toEqual(1000);
      expect(service.center.lng).toEqual(2000);

    });
  })
});
