import expect from 'expect';
import objectsComparer from './objects-comparer';
import { getArrayPaths, getQueryFromPrimitiveValuesFor, compareObjects } from './objects-comparer';

describe('objectsComparer', function () {
  describe("shoult tell that two objects are equal", function() {
    it('if they are simple objects', function () {
      let simpleObj1 = {
        number: 10,
        letter: 'a',
        test: '',
      };
      let simpleObj2 = {
        number: 10,
        letter: 'a',
        test: '',
      };

      const compareResult = objectsComparer(simpleObj1, simpleObj2);

      expect(compareResult).toEqual([]);
    });
    it('if they contain exact arrays', function () {
      let simpleObj1 = {
        items: [10, 'a', '']
      };
      let simpleObj2 = {
        items: [10, 'a', '']
      };

      const compareResult = objectsComparer(simpleObj1, simpleObj2);

      expect(compareResult).toEqual([]);
    });
    it('if they contain arrays with the same objects but different order', function() {
      let simpleObj1 = {
        items: [
          {
            number: 10,
            letter: 'a',
            test: '',
          },
          {
            number: 20,
            letter: 'b',
          }
        ]
      };
      let simpleObj2 = {
        items: [
          {
            number: 20,
            letter: 'b'
          },
          {
            number: 10,
            letter: 'a',
            test: '',
          }
        ]
      };

      const compareResult = objectsComparer(simpleObj1, simpleObj2);

      expect(compareResult).toEqual([]);
    });
    it('if they contain a mix of arrays with the same objects but different order and simple values', function() {
      let simpleObj1 = {
        simple: 'test',
        items: [
          {
            number: 10,
            letter: 'a'
          },
          {
            number: 20,
            letter: 'b'
          }
        ]
      };
      let simpleObj2 = {
        simple: 'test',
        items: [
          {
            number: 20,
            letter: 'b'
          },
          {
            number: 10,
            letter: 'a'
          }
        ]
      };

      const compareResult = objectsComparer(simpleObj1, simpleObj2);

      expect(compareResult).toEqual([]);
    })
  });
  describe('should tell that two objects are different', function () {
    it('if first of the arrays is longer', function() {
      const _first = {myArray: [{abc: "def"}, {agh: "sdf"}, {wrong: "wrong"}]};
      const _second = {myArray: [{abc: "def"}, {agh: "sdf"}] };

      expect (compareObjects(_first, _second)).toEqual([`object2 doesn't contain {"wrong":"wrong"} at path myArray`]);
    });
    // it('if second of the arrays is longer', function() {
    //   const _first = {myArray: [{abc: "def"}, {agh: "sdf"}]};
    //   const _second = {myArray: [{abc: "def"}, {agh: "sdf"}, {wrong: "wrong"}]};
    //
    //   expect (compareObjects(_first, _second)).toEqual([{doesNot: "Match"}]);
    // });
    it('if an array has one of the objects different', function() {
      const _first = {myArray: [{abc: "def"}, {agh: "sdf"}, {differentOne: "other"}]};
      const _second = {myArray: [{abc: "def"}, {agh: "sdf"}, {wrong: "wrong"}] };

      expect(compareObjects(_first, _second)).toEqual([`object2 doesn't contain {"differentOne":"other"} at path myArray`, `object2 doesn't contain {"wrong":"wrong"} at path myArray`]);
    });
  });
  it('should return [] if objects contain nested arrays and objects', function () {
    expect(compareObjects(nestedArrays1, nestedArrays2)).toEqual([]);
  });
  it('should work for objects with unordered nested arrays', function () {
    const object1 = {
      "hoursOfOperation": [
        {
          "name": "Monday",
          "closedIndicator": "N",
          "hours": [
            {
              "openTime": "07:30",
              "closeTime": "17:30"
            }
          ]
        },
        {
          "name": "Friday",
          "closedIndicator": "N",
          "hours": [
            {
              "openTime": "07:30",
              "closeTime": "17:30"
            }
          ]
        },
        {
          "name": "Sunday",
          "closedIndicator": "Y",
          "hours": [
            {}
          ]
        },
        {
          "name": "Saturday",
          "closedIndicator": "N",
          "hours": [
            {
              "openTime": "08:00",
              "closeTime": "12:00"
            }
          ]
        },
        {
          "name": "Wednesday",
          "closedIndicator": "N",
          "hours": [
            {
              "openTime": "07:30",
              "closeTime": "17:30"
            }
          ]
        },
        {
          "name": "Tuesday",
          "closedIndicator": "N",
          "hours": [
            {
              "openTime": "07:30",
              "closeTime": "17:30"
            }
          ]
        },
        {
          "name": "Thursday",
          "closedIndicator": "N",
          "hours": [
            {
              "openTime": "07:30",
              "closeTime": "17:30"
            }
          ]
        }
      ]
    };

    const object2 = {
      "hoursOfOperation": [
        {
          "name": "Sunday",
          "closedIndicator": "Y",
          "hours": [
            {}
          ]
        },
        {
          "name": "Tuesday",
          "closedIndicator": "N",
          "hours": [
            {
              "openTime": "07:30",
              "closeTime": "17:30"
            }
          ]
        },
        {
          "name": "Monday",
          "closedIndicator": "N",
          "hours": [
            {
              "openTime": "07:30",
              "closeTime": "17:30"
            }
          ]
        },
        {
          "name": "Thursday",
          "closedIndicator": "N",
          "hours": [
            {
              "openTime": "07:30",
              "closeTime": "17:30"
            }
          ]
        },
        {
          "name": "Saturday",
          "closedIndicator": "N",
          "hours": [
            {
              "openTime": "08:00",
              "closeTime": "12:00"
            }
          ]
        },
        {
          "name": "Wednesday",
          "closedIndicator": "N",
          "hours": [
            {
              "openTime": "07:30",
              "closeTime": "17:30"
            }
          ]
        },
        {
          "name": "Friday",
          "closedIndicator": "N",
          "hours": [
            {
              "openTime": "07:30",
              "closeTime": "17:30"
            }
          ]
        }
      ]
    };
    
    expect(compareObjects(object1, object2)).toEqual([]);
  });
  it('should work with real objects', function () {
    expect(compareObjects(responseFromAll, responseFromDealerCode)).toEqual([]);
  });
});

describe('getArrayPaths', function () {
  describe('function', function () {
    it('should return correct paths to arrays with array in root object', function () {
      const nestedArrays = {
        departments: [
          {
            "phones": [
              {
                "type": "Primary phone",
                "typeCode": "PRIPHN",
                "number": "5087753049"
              }
            ],
          }
        ]
      };
      const actualPaths = ['departments', 'departments.0.phones'];
      const receivedPaths = getArrayPaths(nestedArrays, '');
      expect(receivedPaths).toEqual(actualPaths);
    });
    it('should return correct paths to arrays with array nested in object', function () {
      const nestedArrays = {
        departments: [
          {
            nested: {
              "phones": [
                {
                  "type": "Primary phone",
                  "typeCode": "PRIPHN",
                  "number": "5087753049"
                }
              ],
            }
          }
        ]
      };
      const actualPaths = ['departments', 'departments.0.nested.phones'];
      const receivedPaths = getArrayPaths(nestedArrays);
      expect(receivedPaths).toEqual(actualPaths);
    });
  });
});

describe('getQueryFromPrimitiveValuesFor', function () {
  describe('functino', function () {
    it('should return correct query for a passed in object', function () {
      let simpleObj = {
        number: 10,
        letter: 'a',
        object: {}
      };

      const query = getQueryFromPrimitiveValuesFor(simpleObj);

      expect(query).toEqual({ number: 10, letter: 'a'});

    });
  });
});

let nestedArrays1 = { //response from all
  "departments": [
    {
      "description": "Parts",
      "departmentCode": "PARTS",
      "contactName": "",
      "email": "",
      "phones": [
        {
          "type": "Primary phone",
          "typeCode": "PRIPHN",
          "number": "5087753049"
        }
      ],
      "hoursOfOperation": [
        {
          "name": "Monday",
          "closedIndicator": "N",
          "hours": [
            {
              "openTime": "07:30",
              "closeTime": "17:30"
            }
          ]
        },
        {
          "name": "Friday",
          "closedIndicator": "N",
          "hours": [
            {
              "openTime": "07:30",
              "closeTime": "17:30"
            }
          ]
        },
        {
          "name": "Sunday",
          "closedIndicator": "Y",
          "hours": [
            {}
          ]
        },
        {
          "name": "Saturday",
          "closedIndicator": "N",
          "hours": [
            {
              "openTime": "08:00",
              "closeTime": "12:00"
            }
          ]
        },
        {
          "name": "Wednesday",
          "closedIndicator": "N",
          "hours": [
            {
              "openTime": "07:30",
              "closeTime": "17:30"
            }
          ]
        },
        {
          "name": "Tuesday",
          "closedIndicator": "N",
          "hours": [
            {
              "openTime": "07:30",
              "closeTime": "17:30"
            }
          ]
        },
        {
          "name": "Thursday",
          "closedIndicator": "N",
          "hours": [
            {
              "openTime": "07:30",
              "closeTime": "17:30"
            }
          ]
        }
      ]
    }
  ]
};

let nestedArrays2 = {
  "departments": [
    {
      "description": "Parts",
      "departmentCode": "PARTS",
      "contactName": "",
      "email": "",
      "phones": [
        {
          "type": "Primary phone",
          "typeCode": "PRIPHN",
          "number": "5087753049"
        }
      ],
      "hoursOfOperation": [
        {
          "name": "Sunday",
          "closedIndicator": "Y",
          "hours": [
            {}
          ]
        },
        {
          "name": "Tuesday",
          "closedIndicator": "N",
          "hours": [
            {
              "openTime": "07:30",
              "closeTime": "17:30"
            }
          ]
        },
        {
          "name": "Monday",
          "closedIndicator": "N",
          "hours": [
            {
              "openTime": "07:30",
              "closeTime": "17:30"
            }
          ]
        },
        {
          "name": "Thursday",
          "closedIndicator": "N",
          "hours": [
            {
              "openTime": "07:30",
              "closeTime": "17:30"
            }
          ]
        },
        {
          "name": "Saturday",
          "closedIndicator": "N",
          "hours": [
            {
              "openTime": "08:00",
              "closeTime": "12:00"
            }
          ]
        },
        {
          "name": "Wednesday",
          "closedIndicator": "N",
          "hours": [
            {
              "openTime": "07:30",
              "closeTime": "17:30"
            }
          ]
        },
        {
          "name": "Friday",
          "closedIndicator": "N",
          "hours": [
            {
              "openTime": "07:30",
              "closeTime": "17:30"
            }
          ]
        }
      ]
    }
  ]
};







let moreComplexObjBase = {
  "servicesOffered": [
    {
      "code": "FCWASH",
      "description": "Free Courtesy Wash"
    },
    {
      "code": "FEAOBDYSHP",
      "description": "Free Estimates At Our Body Shop"
    },
    {
      "code": "OFFDOS",
      "description": "Drop-Off Service"
    },
    {
      "code": "OLSCHED",
      "description": "Online Service Scheduling"
    },
    {
      "code": "SRVXPS",
      "description": "Service Xpress"
    },
    {
      "code": "WHTVWTECH",
      "description": "We Have Trained VW Technicians"
    },
    {
      "code": "RTIOFFPRMO",
      "description": "RTI  After Sales Offer - Fall Promo"
    },
    {
      "code": "SHTSRV",
      "description": "Shuttle Service"
    },
    {
      "code": "SELLNHR",
      "description": "MY15 VW Care Sell and Honor enrollment"
    },
    {
      "code": "WUOGVWPART",
      "description": "We Use Only Genuine Volkswagen Parts"
    },
    {
      "code": "SPECSRVCPRMO",
      "description": "Special Service Promotions"
    },
    {
      "code": "DWRENT",
      "description": "Daily Or Weekly Rentals"
    },
    {
      "code": "SRVEVNT",
      "description": "Service Event"
    },
    {
      "code": "TIREPRMO",
      "description": "Tire Promo"
    },
    {
      "code": "SRVLNR",
      "description": "Service Loaner"
    }
  ],
};





let moreComplexObjCopy = moreComplexObjBase;
let moreComplexObjIncomplete = {
  "servicesOffered": [
    {
      "code": "FEAOBDYSHP",
      "description": "Free Estimates At Our Body Shop"
    },
    {
      "code": "OFFDOS",
      "description": "Drop-Off Service"
    },
    {
      "code": "OLSCHED",
      "description": "Online Service Scheduling"
    },
    {
      "code": "SRVXPS",
      "description": "Service Xpress"
    },
    {
      "code": "WHTVWTECH",
      "description": "We Have Trained VW Technicians"
    },
    {
      "code": "RTIOFFPRMO",
      "description": "RTI  After Sales Offer - Fall Promo"
    },
    {
      "code": "SHTSRV",
      "description": "Shuttle Service"
    },
    {
      "code": "SELLNHR",
      "description": "MY15 VW Care Sell and Honor enrollment"
    },
    {
      "code": "WUOGVWPART",
      "description": "We Use Only Genuine Volkswagen Parts"
    },
    {
      "code": "SPECSRVCPRMO",
      "description": "Special Service Promotions"
    },
    {
      "code": "DWRENT",
      "description": "Daily Or Weekly Rentals"
    },
    {
      "code": "SRVEVNT",
      "description": "Service Event"
    },
    {
      "code": "TIREPRMO",
      "description": "Tire Promo"
    },
    {
      "code": "SRVLNR",
      "description": "Service Loaner"
    }
  ],
};
let moreComplexObjUnordered = {
  "servicesOffered": [
    {
      "code": "FCWASH",
      "description": "Free Courtesy Wash"
    },
    {
      "code": "FEAOBDYSHP",
      "description": "Free Estimates At Our Body Shop"
    },
    {
      "code": "OFFDOS",
      "description": "Drop-Off Service"
    },
    {
      "code": "OLSCHED",
      "description": "Online Service Scheduling"
    },
    {
      "code": "SRVXPS",
      "description": "Service Xpress"
    },
    {
      "code": "WHTVWTECH",
      "description": "We Have Trained VW Technicians"
    },
    {
      "code": "RTIOFFPRMO",
      "description": "RTI  After Sales Offer - Fall Promo"
    },
    {
      "code": "SHTSRV",
      "description": "Shuttle Service"
    },
    {
      "code": "SELLNHR",
      "description": "MY15 VW Care Sell and Honor enrollment"
    },
    {
      "code": "WUOGVWPART",
      "description": "We Use Only Genuine Volkswagen Parts"
    },
    {
      "code": "SPECSRVCPRMO",
      "description": "Special Service Promotions"
    },
    {
      "code": "DWRENT",
      "description": "Daily Or Weekly Rentals"
    },
    {
      "code": "SRVEVNT",
      "description": "Service Event"
    },
    {
      "code": "SRVLNR",
      "description": "Service Loaner"
    },
    {
      "code": "TIREPRMO",
      "description": "Tire Promo"
    }
  ],
};

const responseFromDealerCode = {
  "servicesOffered": [
    {
      "code": "DWRENT",
      "description": "Daily Or Weekly Rentals"
    },
    {
      "code": "SELLNHR",
      "description": "MY15 VW Care Sell and Honor enrollment"
    },
    {
      "code": "RTIOFFPRMO",
      "description": "RTI  After Sales Offer - Fall Promo"
    },
    {
      "code": "SPECSRVCPRMO",
      "description": "Special Service Promotions"
    },
    {
      "code": "OFFDOS",
      "description": "Drop-Off Service"
    },
    {
      "code": "FEAOBDYSHP",
      "description": "Free Estimates At Our Body Shop"
    },
    {
      "code": "OLSCHED",
      "description": "Online Service Scheduling"
    },
    {
      "code": "SRVEVNT",
      "description": "Service Event"
    },
    {
      "code": "SHTSRV",
      "description": "Shuttle Service"
    },
    {
      "code": "SRVXPS",
      "description": "Service Xpress"
    },
    {
      "code": "WUOGVWPART",
      "description": "We Use Only Genuine Volkswagen Parts"
    },
    {
      "code": "WHTVWTECH",
      "description": "We Have Trained VW Technicians"
    },
    {
      "code": "FCWASH",
      "description": "Free Courtesy Wash"
    },
    {
      "code": "TIREPRMO",
      "description": "Tire Promo"
    },
    {
      "code": "SRVLNR",
      "description": "Service Loaner"
    }
  ],
  "departments": [
    {
      "description": "Parts",
      "departmentCode": "PARTS",
      "contactName": "",
      "email": "",
      "phones": [
        {
          "type": "Primary phone",
          "typeCode": "PRIPHN",
          "number": "5087753049"
        }
      ],
      "hoursOfOperation": [
        {
          "name": "Sunday",
          "closedIndicator": "Y",
          "hours": [
            {}
          ]
        },
        {
          "name": "Tuesday",
          "closedIndicator": "N",
          "hours": [
            {
              "openTime": "07:30",
              "closeTime": "17:30"
            }
          ]
        },
        {
          "name": "Monday",
          "closedIndicator": "N",
          "hours": [
            {
              "openTime": "07:30",
              "closeTime": "17:30"
            }
          ]
        },
        {
          "name": "Thursday",
          "closedIndicator": "N",
          "hours": [
            {
              "openTime": "07:30",
              "closeTime": "17:30"
            }
          ]
        },
        {
          "name": "Saturday",
          "closedIndicator": "N",
          "hours": [
            {
              "openTime": "08:00",
              "closeTime": "12:00"
            }
          ]
        },
        {
          "name": "Wednesday",
          "closedIndicator": "N",
          "hours": [
            {
              "openTime": "07:30",
              "closeTime": "17:30"
            }
          ]
        },
        {
          "name": "Friday",
          "closedIndicator": "N",
          "hours": [
            {
              "openTime": "07:30",
              "closeTime": "17:30"
            }
          ]
        }
      ]
    },
    {
      "description": "New Car",
      "departmentCode": "NEWCAR",
      "contactName": "",
      "email": "",
      "phones": [
        {
          "type": "Primary phone",
          "typeCode": "PRIPHN",
          "number": "5087753049"
        }
      ],
      "hoursOfOperation": []
    },
    {
      "description": "Service",
      "departmentCode": "SVC",
      "contactName": "",
      "email": "",
      "phones": [
        {
          "type": "Service Desk Phone",
          "typeCode": "SVCDESKPHN",
          "number": "508-775-30"
        },
        {
          "type": "Primary phone",
          "typeCode": "PRIPHN",
          "number": "5087753049"
        }
      ],
      "hoursOfOperation": [
        {
          "name": "Sunday",
          "closedIndicator": "Y",
          "hours": [
            {}
          ]
        },
        {
          "name": "Saturday",
          "closedIndicator": "N",
          "hours": [
            {
              "openTime": "08:00",
              "closeTime": "12:00"
            }
          ]
        },
        {
          "name": "Wednesday",
          "closedIndicator": "N",
          "hours": [
            {
              "openTime": "07:30",
              "closeTime": "17:30"
            }
          ]
        },
        {
          "name": "Tuesday",
          "closedIndicator": "N",
          "hours": [
            {
              "openTime": "07:30",
              "closeTime": "17:30"
            }
          ]
        },
        {
          "name": "Friday",
          "closedIndicator": "N",
          "hours": [
            {
              "openTime": "07:30",
              "closeTime": "17:30"
            }
          ]
        },
        {
          "name": "Monday",
          "closedIndicator": "N",
          "hours": [
            {
              "openTime": "07:30",
              "closeTime": "17:30"
            }
          ]
        },
        {
          "name": "Thursday",
          "closedIndicator": "N",
          "hours": [
            {
              "openTime": "07:30",
              "closeTime": "17:30"
            }
          ]
        }
      ]
    },
    {
      "description": "Sales",
      "departmentCode": "SALES",
      "contactName": "",
      "email": "",
      "phones": [
        {
          "type": "Primary phone",
          "typeCode": "PRIPHN",
          "number": "5087753049"
        }
      ],
      "hoursOfOperation": []
    },
    {
      "description": "Primary",
      "departmentCode": "PRIM",
      "contactName": "",
      "email": "",
      "phones": [
        {
          "type": "Primary phone",
          "typeCode": "PRIPHN",
          "number": "5087753049"
        },
        {
          "type": "Primary fax",
          "typeCode": "BUSFX",
          "number": "5087785766"
        }
      ],
      "hoursOfOperation": []
    },
    {
      "description": "Corporate",
      "departmentCode": "CORP",
      "contactName": "",
      "email": "",
      "phones": [
        {
          "type": "Primary fax",
          "typeCode": "BUSFX",
          "number": "5087785766"
        },
        {
          "type": "Primary phone",
          "typeCode": "PRIPHN",
          "number": "5087753049"
        }
      ],
      "hoursOfOperation": []
    }
  ],
  "addresses": [
    {
      "addressType": "Marketing Address",
      "addressTypeCode": "MKTGADD",
      "addressLine1": "686 Iyannough Rd",
      "countryCode": "USA",
      "longitude": -70.2924,
      "latitude": 41.6679,
      "city": "Hyannis",
      "state": "MA",
      "zip": "02601"
    },
    {
      "addressType": "Street Address",
      "addressTypeCode": "STREADD",
      "addressLine1": "686 Iyannough Rd",
      "countryCode": "USA",
      "city": "Hyannis",
      "state": "MA",
      "zip": "02601"
    },
    {
      "addressType": "Service Address",
      "addressTypeCode": "SRVCADD",
      "addressLine1": "686 Iyannough Rd",
      "countryCode": "USA",
      "longitude": -70.2924,
      "latitude": 41.6679,
      "city": "Hyannis",
      "state": "MA",
      "zip": "02601"
    },
    {
      "addressType": "Wharehouse Address",
      "addressTypeCode": "WHSEADD",
      "addressLine1": "686 Iyannough Rd",
      "countryCode": "USA",
      "city": "Hyannis",
      "state": "MA",
      "zip": "02601"
    },
    {
      "addressType": "Mailing Address",
      "addressTypeCode": "MAILADD",
      "addressLine1": "Po Box 460",
      "countryCode": "USA",
      "city": "Hyannis",
      "state": "MA",
      "zip": "02601"
    }
  ],
  "dealerCategorizations": [
    {
      "categorizationTypeCode": "OTS",
      "categorizationTypeDesc": "Dealer Service District Code",
      "categorizationCode": "1L"
    },
    {
      "categorizationTypeCode": "REG",
      "categorizationTypeDesc": "Region",
      "categorizationCode": "NER",
      "categorizationDesc": "Northeast Region"
    },
    {
      "categorizationTypeCode": "DMA",
      "categorizationTypeDesc": "Dealer Marketing Area Code",
      "categorizationCode": "506",
      "categorizationDesc": "BOSTON"
    },
    {
      "categorizationTypeCode": "OSS",
      "categorizationTypeDesc": "Dealer Parts District Code",
      "categorizationCode": "1L"
    },
    {
      "categorizationTypeCode": "LMC",
      "categorizationTypeDesc": "Dealer Local Marketing Area Code",
      "categorizationCode": "415",
      "categorizationDesc": "NER-New England LMA"
    },
    {
      "categorizationTypeCode": "AREA",
      "categorizationTypeDesc": "Area Code",
      "categorizationCode": "1L",
      "categorizationDesc": "CT/RI"
    },
    {
      "categorizationTypeCode": "TIER",
      "categorizationTypeDesc": "Dealer Tier",
      "categorizationCode": "2"
    }
  ],
  "dealerIndicators": [
    {
      "indicatorTypeCode": "TOUHYB",
      "indicatorTypeDesc": "Toureg Hybrid Indicator"
    },
    {
      "indicatorTypeCode": "CMPGN",
      "indicatorTypeDesc": "Campaign Indicator"
    },
    {
      "indicatorTypeCode": "EGOLF",
      "indicatorTypeDesc": "eMobility Pilot Dealers"
    },
    {
      "indicatorTypeCode": "CORERTLR",
      "indicatorTypeDesc": "Core Dealer"
    },
    {
      "indicatorTypeCode": "PHEATONDLR"
    },
    {
      "indicatorTypeCode": "INCNENRL",
      "indicatorTypeDesc": "Incentives Enrolment Flag"
    }
  ],
  "dealerNames": [
    {
      "name": "Tracy Volkswagen, Inc.",
      "nameTypeCode": "CORPNME",
      "nameTypeDesc": "Corporate Name"
    },
    {
      "name": "Tracy Volkswagen, Inc.",
      "nameTypeCode": "DBANME",
      "nameTypeDesc": "Doing Business As Name"
    },
    {
      "name": "Tracy Volkswagen, Inc.",
      "nameTypeCode": "MKTGNME",
      "nameTypeDesc": "Marketing Name"
    }
  ],
  "dealerUrls": [
    {
      "url": "www.tracyvw.com/ServiceEvent",
      "urlTypeCode": "SRVEVNTURL",
      "urlTypeDesc": "Service Event URL"
    },
    {
      "url": "www.tracyvw.com",
      "urlTypeCode": "VNTYURL",
      "urlTypeDesc": "Vanity url"
    },
    {
      "url": "www.tracyvw.com",
      "urlTypeCode": "PRIURL",
      "urlTypeDesc": "Primary url"
    },
    {
      "url": "consumer.xtime.com/scheduling/?webKey=vw20120702001034401025&variant=VOLKSWAGENUSA",
      "urlTypeCode": "MOBLURL",
      "urlTypeDesc": "Mobile Scheduling URL"
    },
    {
      "url": "consumer.xtime.com/menu/?make=VOLKSWAGEN&variant=VOLKSWAGENUSA&company_name=VOLKSWAGENUSA&company_code=401025&popupXmmmenu=false&show_header=false",
      "urlTypeCode": "MAINTURL",
      "urlTypeDesc": "Maintainance URL"
    },
    {
      "url": "www.tracyvw.com/cpo",
      "urlTypeCode": "CPOSRCHURL",
      "urlTypeDesc": "CPO Vehicle Search URL"
    },
    {
      "url": "consumer.xtime.com/scheduling/?webKey=vw20120702001034401025&variant=VOLKSWAGENUSA",
      "urlTypeCode": "SRVURL",
      "urlTypeDesc": "Service url"
    }
  ],
  "brand": "VW",
  "id": "401025",
  "groupCode": "415",
  "latitude": 41.6679,
  "longitude": -70.2924,
  "distance": 0,
  "zip": "02601",
  "phone": "5087753049",
  "address1": "686 Iyannough Rd",
  "name": "Tracy Volkswagen, Inc.",
  "city": "Hyannis",
  "state": "MA",
  "regionCode": "NER",
  "url": "www.tracyvw.com"
};

const responseFromAll = {
  "servicesOffered": [
    {
      "code": "FCWASH",
      "description": "Free Courtesy Wash"
    },
    {
      "code": "FEAOBDYSHP",
      "description": "Free Estimates At Our Body Shop"
    },
    {
      "code": "OFFDOS",
      "description": "Drop-Off Service"
    },
    {
      "code": "OLSCHED",
      "description": "Online Service Scheduling"
    },
    {
      "code": "SRVXPS",
      "description": "Service Xpress"
    },
    {
      "code": "WHTVWTECH",
      "description": "We Have Trained VW Technicians"
    },
    {
      "code": "RTIOFFPRMO",
      "description": "RTI  After Sales Offer - Fall Promo"
    },
    {
      "code": "SHTSRV",
      "description": "Shuttle Service"
    },
    {
      "code": "SELLNHR",
      "description": "MY15 VW Care Sell and Honor enrollment"
    },
    {
      "code": "WUOGVWPART",
      "description": "We Use Only Genuine Volkswagen Parts"
    },
    {
      "code": "SPECSRVCPRMO",
      "description": "Special Service Promotions"
    },
    {
      "code": "DWRENT",
      "description": "Daily Or Weekly Rentals"
    },
    {
      "code": "SRVEVNT",
      "description": "Service Event"
    },
    {
      "code": "TIREPRMO",
      "description": "Tire Promo"
    },
    {
      "code": "SRVLNR",
      "description": "Service Loaner"
    }
  ],
  "departments": [
    {
      "description": "Sales",
      "departmentCode": "SALES",
      "contactName": "",
      "email": "",
      "phones": [
        {
          "type": "Primary phone",
          "typeCode": "PRIPHN",
          "number": "5087753049"
        }
      ],
      "hoursOfOperation": []
    },
    {
      "description": "Parts",
      "departmentCode": "PARTS",
      "contactName": "",
      "email": "",
      "phones": [
        {
          "type": "Primary phone",
          "typeCode": "PRIPHN",
          "number": "5087753049"
        }
      ],
      "hoursOfOperation": [
        {
          "name": "Monday",
          "closedIndicator": "N",
          "hours": [
            {
              "openTime": "07:30",
              "closeTime": "17:30"
            }
          ]
        },
        {
          "name": "Friday",
          "closedIndicator": "N",
          "hours": [
            {
              "openTime": "07:30",
              "closeTime": "17:30"
            }
          ]
        },
        {
          "name": "Sunday",
          "closedIndicator": "Y",
          "hours": [
            {}
          ]
        },
        {
          "name": "Saturday",
          "closedIndicator": "N",
          "hours": [
            {
              "openTime": "08:00",
              "closeTime": "12:00"
            }
          ]
        },
        {
          "name": "Wednesday",
          "closedIndicator": "N",
          "hours": [
            {
              "openTime": "07:30",
              "closeTime": "17:30"
            }
          ]
        },
        {
          "name": "Tuesday",
          "closedIndicator": "N",
          "hours": [
            {
              "openTime": "07:30",
              "closeTime": "17:30"
            }
          ]
        },
        {
          "name": "Thursday",
          "closedIndicator": "N",
          "hours": [
            {
              "openTime": "07:30",
              "closeTime": "17:30"
            }
          ]
        }
      ]
    },
    {
      "description": "Primary",
      "departmentCode": "PRIM",
      "contactName": "",
      "email": "",
      "phones": [
        {
          "type": "Primary fax",
          "typeCode": "BUSFX",
          "number": "5087785766"
        },
        {
          "type": "Primary phone",
          "typeCode": "PRIPHN",
          "number": "5087753049"
        }
      ],
      "hoursOfOperation": []
    },
    {
      "description": "New Car",
      "departmentCode": "NEWCAR",
      "contactName": "",
      "email": "",
      "phones": [
        {
          "type": "Primary phone",
          "typeCode": "PRIPHN",
          "number": "5087753049"
        }
      ],
      "hoursOfOperation": []
    },
    {
      "description": "Corporate",
      "departmentCode": "CORP",
      "contactName": "",
      "email": "",
      "phones": [
        {
          "type": "Primary fax",
          "typeCode": "BUSFX",
          "number": "5087785766"
        },
        {
          "type": "Primary phone",
          "typeCode": "PRIPHN",
          "number": "5087753049"
        }
      ],
      "hoursOfOperation": []
    },
    {
      "description": "Service",
      "departmentCode": "SVC",
      "contactName": "",
      "email": "",
      "phones": [
        {
          "type": "Service Desk Phone",
          "typeCode": "SVCDESKPHN",
          "number": "508-775-30"
        },
        {
          "type": "Primary phone",
          "typeCode": "PRIPHN",
          "number": "5087753049"
        }
      ],
      "hoursOfOperation": [
        {
          "name": "Thursday",
          "closedIndicator": "N",
          "hours": [
            {
              "openTime": "07:30",
              "closeTime": "17:30"
            }
          ]
        },
        {
          "name": "Friday",
          "closedIndicator": "N",
          "hours": [
            {
              "openTime": "07:30",
              "closeTime": "17:30"
            }
          ]
        },
        {
          "name": "Wednesday",
          "closedIndicator": "N",
          "hours": [
            {
              "openTime": "07:30",
              "closeTime": "17:30"
            }
          ]
        },
        {
          "name": "Sunday",
          "closedIndicator": "Y",
          "hours": [
            {}
          ]
        },
        {
          "name": "Monday",
          "closedIndicator": "N",
          "hours": [
            {
              "openTime": "07:30",
              "closeTime": "17:30"
            }
          ]
        },
        {
          "name": "Tuesday",
          "closedIndicator": "N",
          "hours": [
            {
              "openTime": "07:30",
              "closeTime": "17:30"
            }
          ]
        },
        {
          "name": "Saturday",
          "closedIndicator": "N",
          "hours": [
            {
              "openTime": "08:00",
              "closeTime": "12:00"
            }
          ]
        }
      ]
    }
  ],
  "addresses": [
    {
      "addressType": "Service Address",
      "addressTypeCode": "SRVCADD",
      "addressLine1": "686 Iyannough Rd",
      "countryCode": "USA",
      "longitude": -70.2924,
      "latitude": 41.6679,
      "city": "Hyannis",
      "state": "MA",
      "zip": "02601"
    },
    {
      "addressType": "Wharehouse Address",
      "addressTypeCode": "WHSEADD",
      "addressLine1": "686 Iyannough Rd",
      "countryCode": "USA",
      "city": "Hyannis",
      "state": "MA",
      "zip": "02601"
    },
    {
      "addressType": "Marketing Address",
      "addressTypeCode": "MKTGADD",
      "addressLine1": "686 Iyannough Rd",
      "countryCode": "USA",
      "longitude": -70.2924,
      "latitude": 41.6679,
      "city": "Hyannis",
      "state": "MA",
      "zip": "02601"
    },
    {
      "addressType": "Street Address",
      "addressTypeCode": "STREADD",
      "addressLine1": "686 Iyannough Rd",
      "countryCode": "USA",
      "city": "Hyannis",
      "state": "MA",
      "zip": "02601"
    },
    {
      "addressType": "Mailing Address",
      "addressTypeCode": "MAILADD",
      "addressLine1": "Po Box 460",
      "countryCode": "USA",
      "city": "Hyannis",
      "state": "MA",
      "zip": "02601"
    }
  ],
  "dealerCategorizations": [
    {
      "categorizationTypeCode": "AREA",
      "categorizationTypeDesc": "Area Code",
      "categorizationCode": "1L",
      "categorizationDesc": "CT/RI"
    },
    {
      "categorizationTypeCode": "OTS",
      "categorizationTypeDesc": "Dealer Service District Code",
      "categorizationCode": "1L"
    },
    {
      "categorizationTypeCode": "TIER",
      "categorizationTypeDesc": "Dealer Tier",
      "categorizationCode": "2"
    },
    {
      "categorizationTypeCode": "LMC",
      "categorizationTypeDesc": "Dealer Local Marketing Area Code",
      "categorizationCode": "415",
      "categorizationDesc": "NER-New England LMA"
    },
    {
      "categorizationTypeCode": "REG",
      "categorizationTypeDesc": "Region",
      "categorizationCode": "NER",
      "categorizationDesc": "Northeast Region"
    },
    {
      "categorizationTypeCode": "DMA",
      "categorizationTypeDesc": "Dealer Marketing Area Code",
      "categorizationCode": "506",
      "categorizationDesc": "BOSTON"
    },
    {
      "categorizationTypeCode": "OSS",
      "categorizationTypeDesc": "Dealer Parts District Code",
      "categorizationCode": "1L"
    }
  ],
  "dealerIndicators": [
    {
      "indicatorTypeCode": "TOUHYB",
      "indicatorTypeDesc": "Toureg Hybrid Indicator"
    },
    {
      "indicatorTypeCode": "PHEATONDLR"
    },
    {
      "indicatorTypeCode": "CORERTLR",
      "indicatorTypeDesc": "Core Dealer"
    },
    {
      "indicatorTypeCode": "CMPGN",
      "indicatorTypeDesc": "Campaign Indicator"
    },
    {
      "indicatorTypeCode": "EGOLF",
      "indicatorTypeDesc": "eMobility Pilot Dealers"
    },
    {
      "indicatorTypeCode": "INCNENRL",
      "indicatorTypeDesc": "Incentives Enrolment Flag"
    }
  ],
  "dealerNames": [
    {
      "name": "Tracy Volkswagen, Inc.",
      "nameTypeCode": "CORPNME",
      "nameTypeDesc": "Corporate Name"
    },
    {
      "name": "Tracy Volkswagen, Inc.",
      "nameTypeCode": "MKTGNME",
      "nameTypeDesc": "Marketing Name"
    },
    {
      "name": "Tracy Volkswagen, Inc.",
      "nameTypeCode": "DBANME",
      "nameTypeDesc": "Doing Business As Name"
    }
  ],
  "dealerUrls": [
    {
      "url": "consumer.xtime.com/scheduling/?webKey=vw20120702001034401025&variant=VOLKSWAGENUSA",
      "urlTypeCode": "SRVURL",
      "urlTypeDesc": "Service url"
    },
    {
      "url": "www.tracyvw.com",
      "urlTypeCode": "VNTYURL",
      "urlTypeDesc": "Vanity url"
    },
    {
      "url": "consumer.xtime.com/scheduling/?webKey=vw20120702001034401025&variant=VOLKSWAGENUSA",
      "urlTypeCode": "MOBLURL",
      "urlTypeDesc": "Mobile Scheduling URL"
    },
    {
      "url": "www.tracyvw.com/ServiceEvent",
      "urlTypeCode": "SRVEVNTURL",
      "urlTypeDesc": "Service Event URL"
    },
    {
      "url": "www.tracyvw.com",
      "urlTypeCode": "PRIURL",
      "urlTypeDesc": "Primary url"
    },
    {
      "url": "www.tracyvw.com/cpo",
      "urlTypeCode": "CPOSRCHURL",
      "urlTypeDesc": "CPO Vehicle Search URL"
    },
    {
      "url": "consumer.xtime.com/menu/?make=VOLKSWAGEN&variant=VOLKSWAGENUSA&company_name=VOLKSWAGENUSA&company_code=401025&popupXmmmenu=false&show_header=false",
      "urlTypeCode": "MAINTURL",
      "urlTypeDesc": "Maintainance URL"
    }
  ],
  "brand": "VW",
  "id": "401025",
  "groupCode": "415",
  "latitude": 41.6679,
  "longitude": -70.2924,
  "distance": 0,
  "zip": "02601",
  "phone": "5087753049",
  "address1": "686 Iyannough Rd",
  "name": "Tracy Volkswagen, Inc.",
  "city": "Hyannis",
  "state": "MA",
  "regionCode": "NER",
  "url": "www.tracyvw.com"
};