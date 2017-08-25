this.loading = {};

this.loading.status = [];

this.loading._show = debounce(function() {
  if (this.loading.status.length > 0) {
    document.getElementById('loading').style.display = 'block';
    document.getElementById('loading-text').style.display = 'block';
  }
}.bind(this), 50);

this.loading._hide = debounce(function() {
  if (this.loading.status.length === 0) {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('loading-text').style.display = 'none';
  }
}.bind(this), 50);

this.loading.show = function showLoading(url) {
  this.loading.status.push(url);
  this.loading._show();
}.bind(this);

this.loading.hide = function hideLoading(url) {
  var index = this.loading.status.indexOf(url);
  if (index > -1) {
    this.loading.status.splice(index, 1);
    this.loading._hide();
  }
}.bind(this);
