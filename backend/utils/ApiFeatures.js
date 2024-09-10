class ApiFeatures {
  constructor(query, queryStr) {
    (this.query = query), (this.queryStr = queryStr);
  }

  search() {
    let { from, to, classes } = this.queryStr;
    let queryObj = classes
      ? {
          $and: [
            {
              stations: {
                $regex: from,
                $options: "i",
              },
            },
            {
              stations: {
                $regex: to,
                $options: "i",
              },
            },
            {
              classes: {
                $regex: classname,
                $options: "i",
              },
            },
          ],
        }
      : {
          $and: [
            {
              stations: {
                $regex: from,
                $options: "i",
              },
            },
            {
              stations: {
                $regex: to,
                $options: "i",
              },
            },
          ],
        };
    this.query = this.query.find(queryObj);
    return this;
  }
}

module.exports = ApiFeatures;
