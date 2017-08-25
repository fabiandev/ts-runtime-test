this.loading = {};

this.loading.status = [];

this.loading._show = debounce(function() {
  if (this.loading.status.length > 0) {
    document.getElementById('loading').style.display = 'block';
  }
}.bind(this), 50);

this.loading._hide = debounce(function() {
  if (this.loading.status.length === 0) {
    document.getElementById('loading').style.display = 'none';
  }
}.bind(this), 50);

this.loading.show = function showLoading() {
  this.loading.status.push(0);
  this.loading._show();
}.bind(this);

this.loading.hide = function hideLoading() {
  this.loading.status.pop();
  this.loading._hide();
}.bind(this);
