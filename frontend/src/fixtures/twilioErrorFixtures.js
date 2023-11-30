const twilioErrorFixtures = {
    oneError:
    [
      {
        "id": 1,
        "content": "error1",
        "errorMessage": "EM1",
        "receiver": "+11111111111",
        "sender": "+18886710358",
        "timestamp": "2023-11-12T03:47:11.808876",
      }
    ],
    threeErrors:
    [
        {
            "id": 2,
            "content": "error2",
            "errorMessage": "EM2",
            "receiver": "+11111111111",
            "sender": "+18886710358",
            "timestamp": "2023-11-12T03:45:41.55297",
        },

        {
            "id": 3,
            "content": "error2",
            "errorMessage": "EM3",
            "receiver": "+11111111111",
            "sender": "+18886710358",
            "timestamp": "2023-11-12T03:47:11.808876",
        },

        {
            "id": 4,
            "content": "error3",
            "errorMessage": "EM4",
            "receiver": "+11111111111",
            "sender": "+18886710358",
            "timestamp": "2023-11-12T03:47:51.270851",
        }
        
    ]
};

const firstPagedFixture = {
    
  "content": [
    {
      
        "id": 30,
        "content": "error30",
        "errorMessage": "EM30",
        "receiver": "+11111111111",
        "sender": "+18886710358",
        "timestamp": "2024-11-24T21:51:17.644146",
    },
    {
      
        "id": 29,
        "content": "error29",
        "errorMessage": "EM29",
        "receiver": "+11111111111",
        "sender": "+18886710358",
        "timestamp": "2024-08-04T01:09:08.790645",
      
    },
    {
      
        "id": 28,
        "content": "error28",
        "errorMessage": "EM28",
        "receiver": "+11111111111",
        "sender": "+18886710358",
        "timestamp": "2024-08-03T01:09:08.790645",
      
      
    },
    {
      
        "id": 27,
        "content": "error27",
        "errorMessage": "EM27",
        "receiver": "+11111111111",
        "sender": "+18886710358",
        "timestamp": "2023-08-24T21:49:56.026918",
        
    
      
    },
    {
      
        "id": 26,
        "content": "error26",
        "errorMessage": "EM26",
        "receiver": "+11111111111",
        "sender": "+18886710358",
        "timestamp": "2023-08-24T21:49:48.278688",
        
      
    },
    {
      
        "id": 25,
        "content": "error25",
        "errorMessage": "EM25",
        "receiver": "+11111111111",
        "sender": "+18886710358",
        "timestamp": "2023-08-24T21:49:44.172651",
        
      
    },
    {
      
        "id": 24,
        "content": "error24",
        "errorMessage": "EM24",
        "receiver": "+11111111111",
        "sender": "+18886710358",
        "timestamp": "2023-08-24T21:49:40.602912",
        
      },
    {
      
        "id": 23,
        "content": "error23",
        "errorMessage": "EM23",
        "receiver": "+11111111111",
        "sender": "+18886710358",
        "timestamp": "2023-08-24T21:49:36.802511",
        
      },
    {
      
        "id": 22,
        "content": "error22",
        "errorMessage": "EM22",
        "receiver": "+11111111111",
        "sender": "+18886710358",
        "timestamp": "2023-08-24T21:49:33.488459",
        
      },
    {
      
        "id": 21,
        "content": "error21",
        "errorMessage": "EM21",
        "receiver": "+11111111111",
        "sender": "+18886710358",
        "timestamp": "2023-08-24T21:49:31.106867",
      
    }
  ],
  "pageable": {
    "sort": {
      "sorted": true,
      "unsorted": false,
      "empty": false
    },
    "pageNumber": 0,
    "pageSize": 10,
    "offset": 0,
    "paged": true,
    "unpaged": false
  },
  "totalPages": 3,
  "totalElements": 30,
  "last": false,
  "size": 10,
  "number": 0,
  "sort": {
    "sorted": true,
    "unsorted": false,
    "empty": false
  },
  "first": true,
  "numberOfElements": 10,
  "empty": false
      
}

const secondPagedFixture = {
    
  "content": [
    {
      
        "id": 20,
        "content": "error20",
        "errorMessage": "EM20",
        "receiver": "+11111111111",
        "sender": "+18886710358",
        "timestamp": "2023-08-24T21:49:28.229408",
        
      },
    {
      
        "id": 19,
        "content": "error19",
        "errorMessage": "EM19",
        "receiver": "+11111111111",
        "sender": "+18886710358",
        "timestamp": "2023-08-24T21:49:24.438798",
        
      },
    {
      
        "id": 18,
        "content": "error18",
        "errorMessage": "EM18",
        "receiver": "+11111111111",
        "sender": "+18886710358",
        "timestamp": "2023-08-24T21:49:21.232491",
        
      },
    {
      
        "id": 17,
        "content": "error17",
        "errorMessage": "EM17",
        "receiver": "+11111111111",
        "sender": "+18886710358",
        "timestamp": "2023-08-24T21:49:18.591473",
        
      },
    {
      
        "id": 16,
        "content": "error16",
        "errorMessage": "EM16",
        "receiver": "+11111111111",
        "sender": "+18886710358",
        "timestamp": "2023-08-24T21:49:15.078777",
        
      },
    {
      
        "id": 15,
        "content": "error15",
        "errorMessage": "EM15",
        "receiver": "+11111111111",
        "sender": "+18886710358",
        "timestamp": "2023-08-24T21:49:12.166436",
        
      },
    {
      
        "id": 14,
        "content": "error14",
        "errorMessage": "EM14",
        "receiver": "+11111111111",
        "sender": "+18886710358",
        "timestamp": "2023-08-24T21:49:08.582609",
        
      },
    {
      
        "id": 13,
        "content": "error13",
        "errorMessage": "EM13",
        "receiver": "+11111111111",
        "sender": "+18886710358",
        "timestamp": "2023-08-24T21:49:05.79907",
        
      },
    {
      
        "id": 12,
        "content": "error12",
        "errorMessage": "EM12",
        "receiver": "+11111111111",
        "sender": "+18886710358",
        "timestamp": "2023-08-24T21:49:02.649196",
        
      },
    {
      
        "id": 11,
        "content": "error11",
        "errorMessage": "EM11",
        "receiver": "+11111111111",
        "sender": "+18886710358",
        "timestamp": "2023-08-24T21:48:59.403401",
      
    }
  ],
  "pageable": {
    "sort": {
      "sorted": true,
      "unsorted": false,
      "empty": false
    },
    "pageNumber": 1,
    "pageSize": 10,
    "offset": 10,
    "paged": true,
    "unpaged": false
  },
  "totalPages": 3,
  "totalElements": 30,
  "last": false,
  "size": 10,
  "number": 1,
  "sort": {
    "sorted": true,
    "unsorted": false,
    "empty": false
  },
  "first": false,
  "numberOfElements": 10,
  "empty": false
      
}

const thirdPagedFixture = {
    
  "content": [
    {
      
        "id": 10,
        "content": "error10",
        "errorMessage": "EM10",
        "receiver": "+11111111111",
        "sender": "+18886710358",
        "timestamp": "2023-08-24T21:48:56.268648",
        
      },
    {
      
        "id": 9,
        "content": "error9",
        "errorMessage": "EM9",
        "receiver": "+11111111111",
        "sender": "+18886710358",
        "timestamp": "2023-08-24T21:48:52.848812",
        
      },
    {
      
        "id": 8,
        "content": "error8",
        "errorMessage": "EM8",
        "receiver": "+11111111111",
        "sender": "+18886710358",
        "timestamp": "2023-08-24T21:48:49.813983",
        
      },
    {
      
        "id": 7,
        "content": "error7",
        "errorMessage": "EM7",
        "receiver": "+11111111111",
        "sender": "+18886710358",
        "timestamp": "2023-08-24T21:48:47.775468",
        
      },
    {
      
        "id": 6,
        "content": "error6",
        "errorMessage": "EM6",
        "receiver": "+11111111111",
        "sender": "+18886710358",
        "timestamp": "2023-08-24T21:48:45.248654",
        
      },
    {
      
        "id": 5,
        "content": "error5",
        "errorMessage": "EM5",
        "receiver": "+11111111111",
        "sender": "+18886710358",
        "timestamp": "2023-08-24T21:48:41.120841",
        
      },
    {
      
        "id": 4,
        "content": "error4",
        "errorMessage": "EM4",
        "receiver": "+11111111111",
        "sender": "+18886710358",
        "timestamp": "2023-08-24T21:48:38.388776",
        
      },
    {
      
        "id": 3,
        "content": "error3",
        "errorMessage": "EM3",
        "receiver": "+11111111111",
        "sender": "+18886710358",
        "timestamp": "2023-08-24T21:48:35.653172",
        
      },
    {
      
        "id": 2,
        "content": "error2",
        "errorMessage": "EM2",
        "receiver": "+11111111111",
        "sender": "+18886710358",
        "timestamp": "2023-08-24T21:48:33.036862",
        
      },
    {
      
        "id": 1,
        "content": "error1",
        "errorMessage": "EM1",
        "receiver": "+11111111111",
        "sender": "+18886710358",
        "timestamp": "2023-08-24T21:47:48.121942",
      
    }
  ],
  "pageable": {
    "sort": {
      "sorted": true,
      "unsorted": false,
      "empty": false
    },
    "pageNumber": 2,
    "pageSize": 10,
    "offset": 20,
    "paged": true,
    "unpaged": false
  },
  "totalPages": 3,
  "totalElements": 30,
  "last": true,
  "size": 10,
  "number": 2,
  "sort": {
    "sorted": true,
    "unsorted": false,
    "empty": false
  },
  "first": false,
  "numberOfElements": 10,
  "empty": false
}


export { twilioErrorFixtures, firstPagedFixture, secondPagedFixture, thirdPagedFixture};

