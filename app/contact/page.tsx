"use client";

import Image from "next/image";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import { Input, Textarea } from "@/app/components/Form/Inputs";
import { Button } from "@/app/components/Button";
import { HiPhone, HiEnvelope, HiMapPin } from "react-icons/hi2";
import { motion } from "framer-motion";

/* Apple-store style form pieces (DESIGN.md §7, §8). The ! keeps these ahead of
   the shared Input's own border/background/radius classes. */
const LABEL = "text-[13px] font-medium text-brand-charcoal";
const FIELD =
  "h-11! rounded-xl! bg-black/[0.04]! border! border-transparent! px-4! py-0! text-[15px]! text-brand-charcoal! placeholder:text-faint! outline-none shadow-none transition-colors focus:bg-white! focus:border-brand-orange! focus:ring-4! focus:ring-brand-orange/15!";
const TEXTAREA =
  "min-h-[160px]! rounded-xl! bg-black/[0.04]! border! border-transparent! px-4! py-3! text-[15px]! text-brand-charcoal! placeholder:text-faint! outline-none shadow-none transition-colors focus:bg-white! focus:border-brand-orange! focus:ring-4! focus:ring-brand-orange/15!";

const CARD = "bg-white rounded-tile p-6 flex items-start gap-4";
const ICON_TILE =
  "w-11 h-11 rounded-xl bg-brand-orange-soft flex items-center justify-center text-brand-orange-text shrink-0";
const CARD_TITLE = "text-[17px] font-semibold text-brand-charcoal tracking-[-0.01em]";
const CARD_TEXT = "text-[15px] text-subtle leading-relaxed";

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-off-white flex flex-col font-sans text-brand-charcoal">
      <Header />

      <main className="flex-1 w-full bg-off-white">
        <div className="max-w-360 mx-auto px-4 sm:px-6 md:px-10 lg:px-16 pt-10 md:pt-16 pb-16 md:pb-28 flex flex-col gap-12 md:gap-20">
          {/* Contact hero */}
          <section className="flex flex-col gap-8 md:gap-10">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col gap-3 max-w-2xl"
            >
              <span className="text-[13px] font-semibold text-brand-orange-text">
                Koolbuy Store support
              </span>
              <h1 className="text-[34px] md:text-[52px] font-semibold text-brand-charcoal tracking-[-0.03em] leading-[1.05]">
                How can we <br />
                <span className="text-subtle">help you?</span>
              </h1>
              <p className="text-[17px] md:text-[19px] text-subtle max-w-xl leading-normal">
                Whether you have a question about features, pricing, or
                anything else, our team is ready to answer all your questions.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full aspect-[2/1] sm:aspect-[1440/488] rounded-tile md:rounded-hero overflow-hidden bg-light-gray"
            >
              <Image
                src="/ContactUs/Banner.png"
                alt="Contact Us"
                fill
                sizes="(min-width: 1440px) 1312px, 100vw"
                className="object-cover"
                priority
              />
            </motion.div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 items-start">
            {/* Contact form */}
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-7 bg-white rounded-tile p-6 sm:p-8 md:p-10 flex flex-col gap-8"
            >
              <div className="flex flex-col gap-2">
                <h2 className="text-[26px] md:text-[30px] font-semibold text-brand-charcoal tracking-[-0.025em] leading-[1.1]">
                  Send us a message
                </h2>
                <p className="text-[15px] md:text-[17px] text-subtle leading-normal">
                  Complete the form below and a member of our Koolbuy Store team
                  will get back to you within 24 hours.
                </p>
              </div>

              <form
                className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-5"
                onSubmit={(e) => e.preventDefault()}
              >
                <div className="flex flex-col gap-1.5">
                  <label className={LABEL}>Full name</label>
                  <Input type="text" placeholder="John Doe" className={FIELD} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className={LABEL}>Email address</label>
                  <Input
                    type="email"
                    placeholder="john@example.com"
                    className={FIELD}
                  />
                </div>
                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <label className={LABEL}>Subject</label>
                  <Input
                    type="text"
                    placeholder="Inquiry about Koolbuy Store services"
                    className={FIELD}
                  />
                </div>
                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <label className={LABEL}>Message</label>
                  <Textarea
                    className={TEXTAREA}
                    placeholder="Write your message here..."
                  />
                </div>
                <div className="md:col-span-2 pt-2">
                  <Button
                    variant="accent"
                    size="lg"
                    shape="pill"
                    type="submit"
                    className="w-full md:w-auto px-8! text-[15px]!"
                  >
                    Submit inquiry
                  </Button>
                </div>
              </form>
            </motion.section>

            {/* Contact information */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-5 flex flex-col gap-4"
            >
              <div className={CARD}>
                <div className={ICON_TILE}>
                  <HiMapPin size={20} />
                </div>
                <div className="flex flex-col gap-1">
                  <h4 className={CARD_TITLE}>Visit us</h4>
                  <p className={CARD_TEXT}>
                    123 Bloom Street, Mist Valley,
                    <br />
                    Lagos, Nigeria 100001
                  </p>
                </div>
              </div>

              <div className={CARD}>
                <div className={ICON_TILE}>
                  <HiPhone size={20} />
                </div>
                <div className="flex flex-col gap-1">
                  <h4 className={CARD_TITLE}>Call us</h4>
                  <p className={CARD_TEXT}>
                    Main Office: +234 800 BLOOM
                    <br />
                    Support: +234 812 MIST CARE
                  </p>
                </div>
              </div>

              <div className={CARD}>
                <div className={ICON_TILE}>
                  <HiEnvelope size={20} />
                </div>
                <div className="flex flex-col gap-1 min-w-0">
                  <h4 className={CARD_TITLE}>Email us</h4>
                  <p className={`${CARD_TEXT} break-words`}>
                    General: hello@bloomandmist.com
                    <br />
                    Support: support@bloomandmist.com
                  </p>
                </div>
              </div>

              {/* Map */}
              <div className="w-full aspect-video rounded-tile bg-light-gray overflow-hidden relative group">
                <iframe
                  title="Koolbuy Store HQ Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126846.5056461955!2d3.310156!3d6.524379!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8b2ae68280c1%3A0xdc9e8ef04e17e476!2sLagos!5e0!3m2!1sen!2sng!4v1713430000000!5m2!1sen!2sng"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="grayscale hover:grayscale-0 transition-all duration-700 ease-apple opacity-90 group-hover:opacity-100"
                ></iframe>
                <div className="absolute top-4 left-4 pointer-events-none">
                  <div className="px-3 py-1.5 bg-white/80 backdrop-blur-xl backdrop-saturate-150 rounded-full text-[12px] font-medium text-brand-charcoal">
                    Koolbuy Store HQ
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ContactPage;
