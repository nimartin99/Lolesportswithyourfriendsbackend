
const catchException = (func) => async (req, res, next) => {
  try {
    if (typeof func !== 'function') {
      throw new Error(`Function ${func} is not a function`);
    }
    await func(req, res, next);
  } catch (error) {
    next(error);
  }
};

export default catchException;
