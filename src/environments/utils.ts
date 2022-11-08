import Decimal from 'decimal.js';

// @ts-ignore
const configParser = (configSource = process.env, type, key, defaultValue) => {
  const val = configSource[key];

  const def = (v) => (defaultValue === undefined ? v : defaultValue);

  switch (type) {
    case 'string': {
      return val || def('');
    }

    case 'array': {
      return val ? val.split(',') : def([]);
    }

    case 'number': {
      if (!val) {
        return def(0);
      }

      const djs = new Decimal(val);
      return djs.toNumber();
    }

    case 'bool': {
      return val ? val === 'true' : def(false);
    }

    default: {
      throw new Error('Unknown variable type');
    }
  }
};

export { configParser };
