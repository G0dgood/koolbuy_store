import Image from "next/image";
import { Icon } from "../Icon";

// Custom SVG components for payment methods and stores
const PaymentIcons = () => (
  <div className="flex items-center gap-4 py-2 px-4 border border-dashed border-purple-200 rounded-xl w-fit">
    <Image src="/payment/amex.png" alt="Amex" width={32} height={20} className="h-5 object-contain" />
    <Image src="/payment/mastercard.png" alt="Mastercard" width={32} height={20} className="h-5 object-contain" />
    <Image src="/payment/pp.png" alt="PayPal" width={32} height={20} className="h-5 object-contain" />
    <Image src="/payment/visa.png" alt="Visa" width={32} height={20} className="h-5 object-contain" />
    <Image src="/payment/applepay.png" alt="Apple Pay" width={32} height={20} className="h-5 object-contain" />
  </div>
);

const StoreButtons = ({ orientation = "horizontal" }: { orientation?: "horizontal" | "vertical" }) => (
  <div className={`
    flex gap-3 w-fit
    ${orientation === "horizontal" 
      ? "items-center py-2 px-4 border border-dashed border-purple-200 rounded-xl" 
      : "flex-col"}
  `}>
    <button className="hover:opacity-80 transition-opacity flex">
      <Image 
        src="/store/app-store.png" 
        alt="Download on the App Store" 
        width={124}
        height={42}
        className="h-10 w-auto object-contain" 
      />
    </button>
    <button className="hover:opacity-80 transition-opacity flex">
      <Image 
        src="/store/google-play.png" 
        alt="Get it on Google Play" 
        width={124}
        height={42}
        className="h-10 w-auto object-contain" 
      />
    </button>
  </div>
);

export { PaymentIcons, StoreButtons };
