'use strict';

module.exports = {
    formatSlug: function (slug) {
        // NGINX handles the mapping so no need for .html extension
        // TODO: make this configurable.
        return slug;
//        return slug + ".html";
    }
};
