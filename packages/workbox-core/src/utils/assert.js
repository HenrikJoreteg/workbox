class Assertions {
  isNumber(value, error) {
    if (typeof value === 'number') {
      return;
    }

    throw error;
  }
}

export default new Assertions();
