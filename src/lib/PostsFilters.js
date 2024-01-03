class PostsFilters {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  searchAllFields() {
    const keyword = this.queryStr.get('keyword');
    // Define the conditions to search for the keyword in title, description, and category
    const searchConditions = {
      $or: [
        { 'title.lang.en': { $regex: keyword, $options: 'i' } },
        { 'title.lang.es': { $regex: keyword, $options: 'i' } },
        { 'title.lang.fr': { $regex: keyword, $options: 'i' } },
        { 'description.lang.en': { $regex: keyword, $options: 'i' } },
        { 'description.lang.es': { $regex: keyword, $options: 'i' } },
        { 'description.lang.fr': { $regex: keyword, $options: 'i' } },
        { 'category.lang.en': { $regex: keyword, $options: 'i' } },
        { 'category.lang.es': { $regex: keyword, $options: 'i' } },
        { 'category.lang.fr': { $regex: keyword, $options: 'i' } },
        { brand: { $regex: keyword, $options: 'i' } },
      ],
    };

    // Use a temporary variable to hold the conditions
    const tempConditions = keyword
      ? { $and: [this.query._conditions || {}, searchConditions] }
      : this.query._conditions; // If no keyword, keep existing conditions

    // Set the conditions to this.query._conditions
    this.query._conditions = tempConditions;

    return this;
  }

  filter() {
    const queryCopy = {};
    this.queryStr.forEach((value, key) => {
      queryCopy[key] = value;
    });

    const removeFields = ['keyword', 'page', 'per_page'];
    removeFields.forEach((el) => delete queryCopy[el]);
    let prop = '';
    //Price Filter for gt> gte>= lt< lte<= in PRICE
    let output = {};
    for (let key in queryCopy) {
      if (!key.match(/\b(gt|gte|lt|lte)/)) {
        output[key] = queryCopy[key];
      } else {
        prop = key.split('[')[0];
        let operator = key.match(/\[(.*)\]/)[1];
        if (!output[prop]) {
          output[prop] = {};
        }

        output[prop][`$${operator}`] = queryCopy[key];
      }
    }
    this.query = this.query.find(output);

    return this;
  }

  newfilter() {
    const queryCopy = {};
    this.queryStr.forEach((value, key) => {
      const langKeys = ['en', 'es', 'fr'];
      langKeys.forEach((lang) => {
        const nestedKey = `${key}.lang.${lang}`;
        queryCopy[nestedKey] = value;
      });
    });

    this.query = this.query.find(queryCopy);

    return this;
  }

  pagination(resPerPage) {
    const currentPage = Number(this.queryStr.get('page')) || 1;

    const skip = resPerPage * (currentPage - 1);

    this.query = this.query.limit(resPerPage).skip(skip);
    return this;
  }
}

export default PostsFilters;
