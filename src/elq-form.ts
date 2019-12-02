declare var Validate: any;

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
    if(!options || options.length < 2) {
      options = this.findOptions(this.allStates, '*');
    }
    this.state.children().remove();
    this.state.append(options);
    this.state.val(this.$(options[0]).val() as string);
    if(options.length > 1) {
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
}

($ => {
  $(document).ready(() => {
    const form = new ElqForm($);
    form.initialize();  
  })
})(jQuery);