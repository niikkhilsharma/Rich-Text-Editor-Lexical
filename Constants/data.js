// Bank data structure
const bankData = {
  "Account Types": [
    "Savings Account",
    "Current Account",
    "Fixed Deposit Account",
    "Recurring Deposit Account",
    "NRI Account",
    "Salary Account",
    "Student Account",
  ],
  "Loan Products": [
    "Home Loan",
    "Personal Loan",
    "Education Loan",
    "Car Loan",
    "Business Loan",
    "Gold Loan",
    "Agriculture Loan",
  ],
  "Branch Types": [
    "Urban Branch",
    "Rural Branch",
    "Metro Branch",
    "Digital Branch",
    "Corporate Branch",
    "Specialized Loan Branch",
  ],
  "Digital Banking Services": [
    "Net Banking",
    "Mobile Banking",
    "UPI Payments",
    "Debit Card Services",
    "Credit Card Services",
    "E-Statement",
    "Bill Payments",
  ],
};

// Function to get all parent categories
export function getParentCategories() {
  return Object.keys(bankData);
}

// Function to get subcategories for a specific parent
export function getSubcategories(parentCategory) {
  return bankData[parentCategory] || [];
}
