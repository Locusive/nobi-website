const WEB3FORMS_ACCESS_KEY = 'c7a3fd79-0e4f-47ce-aa30-c141616d21e3';

/** Send the visitor's chosen setup with their request; reject unacknowledged submissions. */
export async function sendPricingEstimate({ website, name, email, estimate }, fetcher = fetch) {
  const formData = new FormData();
  formData.append('access_key', WEB3FORMS_ACCESS_KEY);
  formData.append('subject', `Nobi Pricing Estimate Request: ${website.trim()}`);
  formData.append('from_name', 'Nobi Pricing Calculator');
  formData.append('website', website.trim());
  formData.append('name', name.trim());
  formData.append('email', email.trim());
  formData.append('message', `Please review my Nobi setup and estimate.\nWebsite: ${website.trim()}\nName: ${name.trim()}\nEmail: ${email.trim()}\nSetup: ${estimate.setup}\nEstimate based on: ${estimate.input_method}\nMonthly searches: ${estimate.searches}\nMonthly assistant messages: ${estimate.messages}\nEstimated monthly cost: $${estimate.estimated_monthly_cost.toFixed(2)}`);
  const response = await fetcher('https://api.web3forms.com/submit', {
    method: 'POST', body: formData, signal: AbortSignal.timeout(20000),
  });
  const data = await response.json();
  if (!response.ok || data.success !== true) throw new Error('Submission was not acknowledged');
}
