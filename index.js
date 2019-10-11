"use strict";

// Data Controller
const dataController = (() => {

  // Blueprint for system temperatures
  class SystemTemperatures {
    constructor(heatFeed, heatReturn, heatTemperature) {
      this.heatFeed = heatFeed;
      this.heatReturn = heatReturn;
      this.heatTemperature = heatTemperature;
    }
  }

  // Blueprint for calculation data.
  class CalculationData extends SystemTemperatures {
    constructor(heatFeed, heatReturn, heatTemperature, value, exponent) {
      super(heatFeed, heatReturn, heatTemperature);
      this.value = value;
      this.exponent = exponent;
    }
  }

  // Data object
  const data = {

    // Fill the data.NORM_VALUES object with data, coming from SystemTemperatures constructor.
    NORM_VALUES: new SystemTemperatures(75, 65, 20), // heatFeed, heatReturn, heatTemperature,

    //  Fill the data.DEFAULT_VALUES object with data, coming from CalculationData constructor.
    DEFAULT_VALUES: new CalculationData(70, 60, 20, 2800, 1.337), // heatFeed, heatReturn, heatTemperature, value, exponent

    // Create an empty data.user object. It will be modified after initializtion.
    user: {}, // result: undefined, heatFeed: 70, heatReturn: 60 , heatTemperature: 20, value: 2800, exponent: 1.337

    // Initialize the data object.
    init() {
      this._setUserData();
    },

    /**
       *  In case the user wants to calculate the result without changing the data.default,
       *  we need a pre-filled user data object. We just copy the data.default object.
       *  We also add the property 'result' which is not available in the data.default object.
       */
    _setUserData() {
      return this.user = Object.assign({ result: undefined }, this.DEFAULT_VALUES);
    }
  };

  /**
   *  The _calculate object contains the NORM_VALUES object which contains the norm temperature values after DIN EN442.
   *  GetResult method calculates the result with the data.user values.
   */
  const _calculate = {

    // Formula to calculate the temperature difference. Argument is a destructered object.
    _getTemperatureDifference({ heatFeed, heatReturn, heatTemperature }) {
      return (heatFeed - heatReturn) / (Math.log((heatFeed - heatTemperature) / (heatReturn - heatTemperature)));
    },

    // Get the norm temperature difference.
    get normTemperautreDifference() {
      return this._getTemperatureDifference(data.NORM_VALUES);
    },

    // get the user temperature difference.
    get userTemperatureDifference() {
      return this._getTemperatureDifference(data.user);
    },

    // Calculate the result and return it.
    getResult() {
      return Math.round(data.user.value * Math.exp((Math.log(this.userTemperatureDifference / this.normTemperautreDifference)) * data.user.exponent));
    }
  };

  return {

    data, // TODO: DELETE LATER

    init() {
      data.init();
    },

    calculate() {
      return data.user.result = _calculate.getResult();
    }
  };
})();

// View Controller
const viewController = (() => {

  const DOMStrings = {
    inputElements: '.inputs__input',
    buttonCalculate: '.button__calculate'
  };

  return {

    getDOMStrings() {
      return DOMStrings;
    },

    displayResult(objResult) {
      console.log(objResult)
    }
  }

})();

// App Controller
const appController = ((dataCtrl, viewCtrl) => {

  // Gett the DOMStrings from viewCtrl and save it in DOM for easier access.
  const DOM = viewCtrl.getDOMStrings();

  // INPUT EVENTS
  const inputElements = (() => {

    const inputHandler = () => {
      dataCtrl.calculate();
      viewCtrl.displayResult(dataCtrl.data.user.result);
    };

    // add an eventListener for each node in the nodeList
    document.querySelectorAll(DOM.inputElements)
      .forEach(node => node.addEventListener('input', inputHandler));

  })();

  // BUTTON EVENTS
  const buttonElements = (() => {

    const buttonResultHandler = () => {
      dataCtrl.calculate();
      viewCtrl.displayResult(dataCtrl.data.user.result);
    };

    // add an eventListener to the calculate button
    document.querySelector(DOM.buttonCalculate)
      .addEventListener('click', buttonResultHandler);

  })();

  return {
    init() {
      dataCtrl.init();
    }
  };
})(dataController, viewController);

appController.init();