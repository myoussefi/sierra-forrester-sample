"use strict";
var TrackingParameters = /** @class */ (function () {
    function TrackingParameters() {
        this.lscPattern = /lsc=(.[^&]*)(&|$)/;
        this.cidPattern = /cid=(.[^&]*)(&|$)/;
        this.typePattern = /campaigntype=(.[^&]*)(&|$)/;
        this.sourcePattern = /utm_source=(.[^&]*)(&|$)/;
        this.mediumPattern = /utm_mdedium=(.[^&]*)(&|$)/;
        this.campaignPattern = /utm_campaign=(.[^&]*)(&|$)/;
        this.lscDefault = 'rf_forrester_rf_roicalc_referral-octave-roi-calc-forrester_referral-octave-roi-calc-forrester';
        this.cidDefault = '7011M000001BdOHQA0';
        this.typeDefault = 'referral';
        this.sourceDefault = 'forrester';
        this.mediumDefault = 'referral';
        this.campaignDefault = 'referral-octave-roi-calc-forrester';
        this.offerTypeDefault = 'roi-calculator';
        this.offerNameDefault = 'octave-roi-calc';
    }
    TrackingParameters.prototype.getQueryString = function (pattern) {
        var qs = window.location.search;
        if (pattern.test(qs)) {
            var match = pattern.exec(qs);
            if (match.length > 2) {
                return match[1];
            }
        }
    };
    TrackingParameters.prototype.getQueryStringOrDefault = function (pattern, defValue) {
        var qsValue = this.getQueryString(pattern);
        return qsValue ? qsValue : defValue;
    };
    Object.defineProperty(TrackingParameters.prototype, "lsc", {
        get: function () {
            return this.getQueryStringOrDefault(this.lscPattern, this.lscDefault);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TrackingParameters.prototype, "cid", {
        get: function () {
            return this.getQueryStringOrDefault(this.cidPattern, this.cidDefault);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TrackingParameters.prototype, "type", {
        get: function () {
            return this.getQueryStringOrDefault(this.typePattern, this.typeDefault);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TrackingParameters.prototype, "source", {
        get: function () {
            return this.getQueryStringOrDefault(this.sourcePattern, this.sourceDefault);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TrackingParameters.prototype, "medium", {
        get: function () {
            return this.getQueryStringOrDefault(this.mediumPattern, this.mediumDefault);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TrackingParameters.prototype, "campaign", {
        get: function () {
            return this.getQueryStringOrDefault(this.campaignPattern, this.campaignDefault);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TrackingParameters.prototype, "offerType", {
        get: function () {
            return this.offerTypeDefault;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TrackingParameters.prototype, "offerName", {
        get: function () {
            return this.offerNameDefault;
        },
        enumerable: true,
        configurable: true
    });
    return TrackingParameters;
}());
var ElqForm = /** @class */ (function () {
    function ElqForm($) {
        this.$ = $;
        this.allStates = this.state.children();
        this.allApplications = this.application.children();
    }
    ElqForm.prototype.initialize = function () {
        this.handleCountryChange();
        this.handleIndustryChange();
        this.setTrackingParameters();
    };
    ElqForm.prototype.setTrackingParameters = function () {
        var trackingParameters = new TrackingParameters();
        this.updateOrKeepDefaultValue(this.lscFields, trackingParameters.lsc);
        this.updateOrKeepDefaultValue(this.typeFields, trackingParameters.type);
        this.updateOrKeepDefaultValue(this.sourceFields, trackingParameters.source);
        this.updateOrKeepDefaultValue(this.mediumFields, trackingParameters.medium);
        this.updateOrKeepDefaultValue(this.offerTypeFields, trackingParameters.offerType);
        this.updateOrKeepDefaultValue(this.offerNameFields, trackingParameters.offerName);
        this.updateOrKeepDefaultValue(this.campaignNameFields, trackingParameters.campaign);
        this.updateOrKeepDefaultValue(this.cidField, trackingParameters.cid);
    };
    ElqForm.prototype.updateOrKeepDefaultValue = function (field, currentValue) {
        var defaultValue = field.val();
        if (currentValue && currentValue !== defaultValue) {
            field.val(currentValue);
        }
    };
    ElqForm.prototype.handleIndustryChange = function () {
        var _this = this;
        this.industry.change(function () {
            _this.onIndustryChange();
        });
    };
    ElqForm.prototype.onIndustryChange = function () {
        var industry = this.industry.val();
        var options = this.findOptions(this.allApplications, industry, true);
        this.application.children().remove();
        this.application.append(options);
        this.application.val(this.$(options[0]).val());
    };
    ElqForm.prototype.handleCountryChange = function () {
        var _this = this;
        this.country.change(function () {
            _this.onCountryChange();
        });
    };
    ElqForm.prototype.onCountryChange = function () {
        var country = this.country.val();
        var options = this.findOptions(this.allStates, country, true);
        if (!options || options.length < 2) {
            options = this.findOptions(this.allStates, '*');
        }
        this.state.children().remove();
        this.state.append(options);
        this.state.val(this.$(options[0]).val());
        if (options.length > 1) {
            this.makeFieldRequired(this.state);
        }
        else {
            this.makeFieldNotRequired(this.state);
        }
    };
    ElqForm.prototype.makeFieldRequired = function (field) {
        var label = this.findLabel(field);
        var validationObject = this.findValidatorObject(field);
        validationObject.add(Validate.Presence, {
            failureMessage: "This field is required"
        });
        label.append('<span class="elq-required">*</span>');
    };
    ElqForm.prototype.makeFieldNotRequired = function (field) {
        var label = this.findLabel(field);
        var validationObject = this.findValidatorObject(field);
        validationObject.validations.length = 0;
        label.find('span').remove();
    };
    ElqForm.prototype.findValidatorObject = function (field) {
        var id = field.attr('id');
        return window[id];
    };
    ElqForm.prototype.findLabel = function (field) {
        var id = field.attr('id');
        var query = "label[for='" + id + "']";
        return this.form.find(query);
    };
    ElqForm.prototype.findOptions = function (source, criteria, allowUndefined) {
        var _this = this;
        if (allowUndefined === void 0) { allowUndefined = false; }
        return source.filter(function (_, option) {
            var parent = _this.$(option).data('parent');
            return parent === criteria || (allowUndefined && parent === undefined);
        });
    };
    Object.defineProperty(ElqForm.prototype, "form", {
        get: function () {
            return this.$('form.elq-form');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ElqForm.prototype, "country", {
        get: function () {
            return this.form.find('select[name="country"]');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ElqForm.prototype, "state", {
        get: function () {
            return this.form.find('select[name="stateProvince"]');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ElqForm.prototype, "industry", {
        get: function () {
            return this.form.find('select[name="industry"]');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ElqForm.prototype, "application", {
        get: function () {
            return this.form.find('select[name="application"]');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ElqForm.prototype, "lscFields", {
        get: function () {
            return this.form.find('input[name="MarketingLeadSourceCode"],input[name="mostRecentLeadSource"]');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ElqForm.prototype, "typeFields", {
        get: function () {
            return this.form.find('input[name="CampaignType"],input[name="CampaignTypeOriginal"]');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ElqForm.prototype, "sourceFields", {
        get: function () {
            return this.form.find('input[name="CampaignSource"],input[name="CampaignSourceOriginal"]');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ElqForm.prototype, "mediumFields", {
        get: function () {
            return this.form.find('input[name="CampaignMedium"],input[name="CampaignMediumOriginal"]');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ElqForm.prototype, "offerTypeFields", {
        get: function () {
            return this.form.find('input[name="CampaignOffer"],input[name="CampaignOfferTypeOriginal"]');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ElqForm.prototype, "offerNameFields", {
        get: function () {
            return this.form.find('input[name="CampaignOfferName"],input[name="CampaignOfferNameOriginal"]');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ElqForm.prototype, "campaignNameFields", {
        get: function () {
            return this.form.find('input[name="CampaignName"],input[name="CampaignNameOriginal"]');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ElqForm.prototype, "cidField", {
        get: function () {
            return this.form.find('input[name="CampaignId"]');
        },
        enumerable: true,
        configurable: true
    });
    return ElqForm;
}());
(function ($) {
    $(document).ready(function () {
        var form = new ElqForm($);
        form.initialize();
    });
})(jQuery);
