declare var Validate: any;

class TrackingParameters {
  private lscPattern = /lsc=(.[^&]*)(&|$)/;
  private cidPattern = /cid=(.[^&]*)(&|$)/;
  private typePattern = /campaigntype=(.[^&]*)(&|$)/;
  private sourcePattern = /utm_source=(.[^&]*)(&|$)/;
  private mediumPattern = /utm_mdedium=(.[^&]*)(&|$)/;
  private campaignPattern = /utm_campaign=(.[^&]*)(&|$)/;

  private lscDefault = 'rf_forrester_rf_roicalc_referral-octave-roi-calc-forrester_referral-octave-roi-calc-forrester';
  private cidDefault = '7011M000001BdOHQA0';
  private typeDefault = 'referral';
  private sourceDefault = 'forrester';
  private mediumDefault = 'referral';
  private campaignDefault = 'referral-octave-roi-calc-forrester';
  private offerTypeDefault = 'roi-calculator';
  private offerNameDefault = 'octave-roi-calc';

  getQueryString(pattern: RegExp) {
    const qs = window.location.search;
    if (pattern.test(qs)) {
      const match: RegExpExecArray = pattern.exec(qs) as RegExpExecArray;
      if (match.length > 2) {
        return match[1];
      }
    }
  }

  getQueryStringOrDefault(pattern: RegExp, defValue: string): string {
    const qsValue = this.getQueryString(pattern);
    return qsValue ? qsValue : defValue;
  }

  get lsc() {
    return this.getQueryStringOrDefault(this.lscPattern, this.lscDefault);
  }

  get cid() {
    return this.getQueryStringOrDefault(this.cidPattern, this.cidDefault);
  }

  get type() {
    return this.getQueryStringOrDefault(this.typePattern, this.typeDefault);
  }

  get source() {
    return this.getQueryStringOrDefault(this.sourcePattern, this.sourceDefault);
  }

  get medium() {
    return this.getQueryStringOrDefault(this.mediumPattern, this.mediumDefault);
  }

  get campaign() {
    return this.getQueryStringOrDefault(this.campaignPattern, this.campaignDefault);
  }

  get offerType() {
    return this.offerTypeDefault;
  }

  get offerName() {
    return this.offerNameDefault;
  }
}

class ElqForm {
  private allStates: JQuery<HTMLElement>;
  private allApplications: JQuery<HTMLElement>;

  constructor(private $: JQueryStatic) {
    this.allStates = this.state.children();
    this.allApplications = this.application.children();
  }

  initialize() {
    this.handleCountryChange();
    this.handleIndustryChange();
    this.setTrackingParameters();
  }

  setTrackingParameters() {
    const trackingParameters = new TrackingParameters();
    this.updateOrKeepDefaultValue(this.lscFields, trackingParameters.lsc);
    this.updateOrKeepDefaultValue(this.typeFields, trackingParameters.type);
    this.updateOrKeepDefaultValue(this.sourceFields, trackingParameters.source);
    this.updateOrKeepDefaultValue(this.mediumFields, trackingParameters.medium);
    this.updateOrKeepDefaultValue(this.offerTypeFields, trackingParameters.offerType);
    this.updateOrKeepDefaultValue(this.offerNameFields, trackingParameters.offerName);
    this.updateOrKeepDefaultValue(this.campaignNameFields, trackingParameters.campaign);
    this.updateOrKeepDefaultValue(this.cidField, trackingParameters.cid);
  }

  updateOrKeepDefaultValue(field: JQuery<HTMLElement>, currentValue: string) {
    const defaultValue = field.val();
    if (currentValue && currentValue !== defaultValue) {
      field.val(currentValue);
    }
  }

  handleIndustryChange() {
    this.industry.change(() => {
      this.onIndustryChange();
    });
  }

  onIndustryChange() {
    const industry: string = this.industry.val() as string;
    const options = this.findOptions(this.allApplications, industry, true);
    this.application.children().remove();
    this.application.append(options);
    this.application.val(this.$(options[0]).val() as string);
  }

  handleCountryChange() {
    this.country.change(() => {
      this.onCountryChange();
    })
  }

  onCountryChange() {
    const country: string = this.country.val() as string;
    let options = this.findOptions(this.allStates, country, true);
    if (!options || options.length < 2) {
      options = this.findOptions(this.allStates, '*');
    }
    this.state.children().remove();
    this.state.append(options);
    this.state.val(this.$(options[0]).val() as string);
    if (options.length > 1) {
      this.makeFieldRequired(this.state);
    } else {
      this.makeFieldNotRequired(this.state);
    }
  }

  makeFieldRequired(field: JQuery<HTMLElement>) {
    const label = this.findLabel(field);
    const validationObject = this.findValidatorObject(field);
    validationObject.add(Validate.Presence, {
      failureMessage: "This field is required"
    });
    label.append('<span class="elq-required">*</span>');
  }

  makeFieldNotRequired(field: JQuery<HTMLElement>) {
    const label = this.findLabel(field);
    const validationObject = this.findValidatorObject(field);
    validationObject.validations.length = 0;
    label.find('span').remove();
  }

  findValidatorObject(field: JQuery<HTMLElement>): any {
    const id = field.attr('id') as string;
    return (window as any)[id];
  }

  findLabel(field: JQuery<HTMLElement>): JQuery<HTMLElement> {
    const id = field.attr('id');
    const query = `label[for='${id}']`;
    return this.form.find(query);
  }

  findOptions(source: JQuery<HTMLElement>, criteria: string, allowUndefined: boolean = false) {
    return source.filter((_, option) => {
      const parent = this.$(option).data('parent');
      return parent === criteria || (allowUndefined && parent === undefined);
    });
  }

  get form() {
    return this.$('form.elq-form');
  }

  get country() {
    return this.form.find('select[name="country"]');
  }

  get state() {
    return this.form.find('select[name="stateProvince"]');
  }

  get industry() {
    return this.form.find('select[name="industry"]');
  }

  get application() {
    return this.form.find('select[name="application"]');
  }

  get lscFields() {
    return this.form.find('input[name="MarketingLeadSourceCode"],input[name="mostRecentLeadSource"]');
  }

  get typeFields() {
    return this.form.find('input[name="CampaignType"],input[name="CampaignTypeOriginal"]');
  }

  get sourceFields() {
    return this.form.find('input[name="CampaignSource"],input[name="CampaignSourceOriginal"]');
  }

  get mediumFields() {
    return this.form.find('input[name="CampaignMedium"],input[name="CampaignMediumOriginal"]');
  }

  get offerTypeFields() {
    return this.form.find('input[name="CampaignOffer"],input[name="CampaignOfferTypeOriginal"]');
  }

  get offerNameFields() {
    return this.form.find('input[name="CampaignOfferName"],input[name="CampaignOfferNameOriginal"]');
  }

  get campaignNameFields() {
    return this.form.find('input[name="CampaignName"],input[name="CampaignNameOriginal"]');
  }

  get cidField() {
    return this.form.find('input[name="CampaignId"]');
  }
}

($ => {
  $(document).ready(() => {
    const form = new ElqForm($);
    form.initialize();
  })
})(jQuery);