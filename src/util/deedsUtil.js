// deedsUtil.js - A utility file for working with deeds.

// Checks if the deed entered by the user already exists in the database.
function checkIfDeedExists(deedDescription, deeds) {
    let exists = false;                                                                     // Flag that assumes deed doesn't exist.

    if (deeds.length > 0) {
        for (d of deeds) {
            if (d.deedDescription.toLowerCase() === deedDescription.toLowerCase()) {        // Converts to lowercase for check.
                exists = true;                                                              // Changes flag to signal that deed exists.
                break;
            }
        }
    }

    return exists;
}

module.exports = {                                                                          // Allows functions to be used by other files.
    checkIfDeedExists: checkIfDeedExists
};