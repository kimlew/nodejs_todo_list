// form_validation_helpers

// Simple validation method that executes when form is submitted. 
// Validates text fields - checks if empty.

/*jslint indent: 2 */

"use strict"; // Tells js interpreter to use strict mode.

function isFormFieldFilledIn(value) {
  if (value === null || value === "") {
    console.log("isFormFieldFilledIn returns false");
    return false;
  }
  console.log("isFormFieldFilledIn returns true");
  return true;
}