/**
 * Model the introductory deliveries and the next full-price delivery using integer cents.
 * Each food discount rounds once, then shipping is added. Delivered boxes are not calendar weeks.
 *
 * @param {{foodCents:number, shippingCents:number, foodDiscountPercentages:number[]}} plan The dated plan inputs.
 * @param {number} deliveryCount How many boxes to total, through the first full-price box.
 * @returns {{deliveries:object[], foodCents:number, shippingCents:number, totalCents:number, fullDeliveryCents:number}}
 * The complete schedule and selected delivery totals, excluding taxes, extras and later plan/price changes.
 */
export function calculateDeliveryCost(plan, deliveryCount) {
  if (!plan || !Number.isSafeInteger(plan.foodCents) || plan.foodCents < 0
      || !Number.isSafeInteger(plan.shippingCents) || plan.shippingCents < 0
      || !Array.isArray(plan.foodDiscountPercentages) || !plan.foodDiscountPercentages.length
      || plan.foodDiscountPercentages.some(discount => !Number.isInteger(discount) || discount < 0 || discount > 100)) {
    throw new Error("Use food and shipping in whole cents and food discounts from 0 to 100 percent.");
  }
  const discounts = [...plan.foodDiscountPercentages, 0];
  if (!Number.isInteger(deliveryCount) || deliveryCount < 1 || deliveryCount > discounts.length) {
    throw new Error(`Choose between 1 and ${discounts.length} delivered boxes.`);
  }
  const deliveries = discounts.map((discount, index) => {
    const foodCents = Math.round(plan.foodCents * (100 - discount) / 100);
    return { number: index + 1, discount, foodCents, shippingCents: plan.shippingCents, totalCents: foodCents + plan.shippingCents };
  });
  const includedDeliveries = deliveries.slice(0, deliveryCount);
  const sum = field => includedDeliveries.reduce((total, delivery) => total + delivery[field], 0);
  const result = {
    deliveries, foodCents: sum("foodCents"), shippingCents: sum("shippingCents"),
    totalCents: sum("totalCents"), fullDeliveryCents: plan.foodCents + plan.shippingCents,
  };
  if (![result.foodCents, result.shippingCents, result.totalCents, result.fullDeliveryCents].every(Number.isSafeInteger)) {
    throw new Error("The delivery total is too large to calculate in whole cents.");
  }
  return result;
}

/** Display exact USD cents without converting a delivery into a monthly price. */
export function formatDeliveryMoney(cents) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);
}
