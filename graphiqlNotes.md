/*

// Get Company with id, name, description
// Note: Why opening curly braces?
//    - Must imagine this query block is being passed into the root query
{
  company(id: "1") {
    id
    name
    description
  }
}

// Can name queries/mutations (only helpful on frontend)
query CompanyQuery {
  company(id: "1") {
    id
    name
    description
  }
}

// Can also rename the fields that you get back
// Could not have these two queries otherwise because cannot return object
// that has two of the same keys
query CompanyQuery {
  apple: company(id: "1") {
    id
    name
    description
  }

  google: company(id: "2") {
    id
    name
    description
  }
}

// If you don't want to repeat params, you can pull them out into a fragment
query CompanyQuery {
  apple: company(id: "1") {
    ...companyDetails
  }

  google: company(id: "2") {
    ...companyDetails
  }

  fragment companyDetails on Company {   // Need type to Graphql can do type checking
    id
    name
    description
  }
}


*/
