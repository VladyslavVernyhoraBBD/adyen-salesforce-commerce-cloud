/**
 *
 */

require('dw/order');
const AdyenHelper = require('*/cartridge/scripts/util/adyenHelper');

const __LineItemHelper = {
  getDescription(lineItem) {
    if (lineItem instanceof dw.order.ShippingLineItem) {
      return lineItem.getID();
    }
    if (lineItem instanceof dw.order.ProductLineItem) {
      return lineItem.product.name;
    }
    if (lineItem instanceof dw.order.PriceAdjustment) {
      return 'Discount';
    }

    return null;
  },

  getId(lineItem) {
    if (
      lineItem instanceof dw.order.ShippingLineItem ||
      lineItem instanceof dw.order.PriceAdjustment
    ) {
      return lineItem.UUID;
    }
    if (lineItem instanceof dw.order.ProductLineItem) {
      return lineItem.product.ID;
    }

    return null;
  },

  getQuantity(lineItem) {
    if (lineItem instanceof dw.order.ShippingLineItem) {
      return '1';
    }
    if (lineItem instanceof dw.order.ProductLineItem) {
      return lineItem.quantityValue.toFixed();
    }
    if (lineItem instanceof dw.order.PriceAdjustment) {
      return lineItem.quantity.toFixed();
    }

    return null;
  },

  getVatPercentage(lineItem) {
    let vatPercentage = 0;
    if (__LineItemHelper.getVatAmount(lineItem) !== 0) {
      vatPercentage = lineItem.getTaxRate();
    }
    return vatPercentage;
  },

  getVatAmount(lineItem) {
    if (
      lineItem instanceof dw.order.ProductLineItem ||
      lineItem instanceof dw.order.ShippingLineItem
    ) {
      return AdyenHelper.getCurrencyValueForApi(lineItem.getAdjustedTax());
    }
    if (lineItem instanceof dw.order.PriceAdjustment && lineItem.getPromotion().getPromotionClass() !== 'ORDER') {
      return AdyenHelper.getCurrencyValueForApi(lineItem.tax);
    }
    return null;
  },

  getItemAmount(lineItem) {
    if (
      lineItem instanceof dw.order.ProductLineItem ||
      lineItem instanceof dw.order.ShippingLineItem
    ) {
      return AdyenHelper.getCurrencyValueForApi(lineItem.adjustedNetPrice);
    }
    if (lineItem instanceof dw.order.PriceAdjustment) {
      return AdyenHelper.getCurrencyValueForApi(lineItem.netPrice);
    }
    return null;
  },
};

module.exports = __LineItemHelper;
