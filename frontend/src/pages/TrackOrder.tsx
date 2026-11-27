import { useState, type ChangeEvent,  } from 'react';
import { useQuery } from '@tanstack/react-query';
import { trackOrder, OrderNotFoundError } from '../services/orders';
import { trackSchema, type TrackInput } from '../schemas/track';
import { useSearchParams } from 'react-router-dom';
import OrderResult from '../components/OrderResult';

type FieldErrors = Partial<Record<'code' | 'phone', string>>;

export default function TrackOrder() {
  // 1. What the customer is typing
  const [searchParams]= useSearchParams();
  const [code, setCode] =useState(()=>searchParams.get('code')??'');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});
 
 

  // 2. What they actually searched for (null until the first valid submit)
  const [submitted, setSubmitted] = useState<TrackInput | null>(null);

  // 3. The query: only runs once `submitted` is set
  const orderQuery = useQuery({
    queryKey: ['track', submitted?.code, submitted?.phone],
    queryFn: () => trackOrder(submitted!.code, submitted!.phone),
    enabled: submitted !== null,
    retry: (failureCount, error) =>
      !(error instanceof OrderNotFoundError) && failureCount < 2,
  });

  // 4. Validate, then save the cleaned values (which starts the query)
  const handleSubmit = (event:ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();

    const result = trackSchema.safeParse({ code, phone });

    if (!result.success) {
      const fieldErrors: FieldErrors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as 'code' | 'phone';
        fieldErrors[field] ??= issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setSubmitted(result.data);
  };

  // 5. What the customer sees
  return (
    <div>
      <h1>Track your order</h1>
      <p>Enter the order code from your confirmation and the phone number you used.</p>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="code">Order code</label>
          <input
            id="code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="CL-XXXXX"
            autoComplete="off"
            aria-invalid={!!errors.code}
          />
          {errors.code && <p className="field-error">{errors.code}</p>}
        </div>

        <div>
          <label htmlFor="phone">Phone number</label>
          <input
            id="phone"
            type="tel"
            inputMode="numeric"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            autoComplete="tel"
            autoFocus={code!==''}
            aria-invalid={!!errors.phone}
          />
          {errors.phone && <p className="field-error">{errors.phone}</p>}
        </div>

        <button type="submit" disabled={orderQuery.isFetching}>
          Track order
        </button>
      </form>

      {orderQuery.isLoading && <p>Looking up your order…</p>}

      {orderQuery.isError &&
        (orderQuery.error instanceof OrderNotFoundError ? (
          <p>We couldn't find an order with that code and phone number. Please check both and try again.</p>
        ) : (
          <p>Something went wrong on our side. Please try again in a moment.</p>
        ))}
        {orderQuery.data && <OrderResult order={orderQuery.data} />}
      
    </div>
  );
}

