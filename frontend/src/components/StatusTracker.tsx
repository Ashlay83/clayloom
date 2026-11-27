import type { OrderStatus } from "../services/orders";
import { PROGRESS_STEPS,STATUS_INFO } from "../utils/orderStatus";

type Props ={
    status:OrderStatus;
}

export default function StatusTracker({status}:Props){
    if(status==='cancelled')return null;

    const currentIndex=PROGRESS_STEPS.indexOf(status);

    return(
        <ol className="status-tracker">
      {PROGRESS_STEPS.map((step, index) => {
        const state =
          index < currentIndex ? 'done' : index === currentIndex ? 'current' : 'upcoming';

        return (
          <li
            key={step}
            className={state}
            aria-current={state === 'current' ? 'step' : undefined}
          >
            {STATUS_INFO[step].label}
          </li>
        );
      })}
    </ol>
    )
}