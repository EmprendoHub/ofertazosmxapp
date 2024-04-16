class APIReportsFilters {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  searchAllFields() {
    const branch = this.queryStr.get("branch");
    const paid = this.queryStr.get("paid");

    let searchConditions = {};

    if (paid) {
      searchConditions["orderStatus"] = { $regex: paid, $options: "i" };
    }

    if (branch) {
      searchConditions["branch"] = { $regex: branch, $options: "i" };
    }

    // If both filters are provided, both will be included in the searchConditions
    // without overriding each other
    if (Object.keys(searchConditions).length) {
      this.query._conditions = {
        ...this.query._conditions,
        ...searchConditions,
      };
    }

    return this;
  }

  filter() {
    const queryCopy = {};
    this.queryStr.forEach((value, key) => {
      queryCopy[key] = value;
    });

    const removeFields = ["branch", "paid", "page", "per_page"];
    removeFields.forEach((el) => delete queryCopy[el]);

    let output = {};
    for (let key in queryCopy) {
      if (key.match(/\b(gt|gte|lt|lte)\b/)) {
        const prop = key.split("[")[0]; // Extract field name (e.g., 'createdAt')
        const operator = key.match(/\[(.*)\]/)[1]; // Extract operator (e.g., 'gte')
        if (!output[prop]) {
          output[prop] = {};
        }
        // Convert the date string to a Date object for MongoDB
        output[prop][`$${operator}`] = new Date(queryCopy[key]);
      } else {
        output[key] = queryCopy[key];
      }
    }

    this.query = this.query.find(output);

    return this;
  }
}

export default APIReportsFilters;
