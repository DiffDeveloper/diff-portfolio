import { useState } from "react";
import emailjs from "@emailjs/browser";
import Alert from "../components/Alert";
import { Particles } from "../components/Particles";

const EMAILJS_SERVICE_ID =
  import.meta.env.VITE_EMAILJS_SERVICE_ID || "service_fw0ou4y";
const EMAILJS_TEMPLATE_ID =
  import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "template_u2r31l6";
const EMAILJS_PUBLIC_KEY =
  import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "jmw8meK9juU2pnwmS";
const DIRECT_EMAIL = "mkthanswe@gmail.com";

const getEmailErrorMessage = (error) => {
  const errorText = `${error?.text || ""} ${error?.message || ""}`.toLowerCase();

  if (errorText.includes("invalid grant")) {
    return `Email service is temporarily unavailable. Please contact me directly at ${DIRECT_EMAIL}.`;
  }

  if (errorText.includes("public key") || errorText.includes("forbidden")) {
    return "Email configuration is currently invalid. Please try again in a moment.";
  }

  if (errorText.includes("network") || errorText.includes("failed to fetch")) {
    return "Network issue detected. Please check your connection and try again.";
  }

  return `Something went wrong while sending your message. Please email me directly at ${DIRECT_EMAIL}.`;
};

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState("success");
  const [alertMessage, setAlertMessage] = useState("");
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const showAlertMessage = (type, message) => {
    setAlertType(type);
    setAlertMessage(message);
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 5000);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);

    try {
      if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
        throw new Error("EmailJS config missing");
      }

      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name: formData.name,
          to_name: "Diff",
          from_email: formData.email,
          to_email: DIRECT_EMAIL,
          reply_to: formData.email,
          message: formData.message,
        },
        {
          publicKey: EMAILJS_PUBLIC_KEY,
        }
      );

      setIsLoading(false);
      setFormData({ name: "", email: "", message: "" });
      showAlertMessage("success", "Your message has been sent successfully!");
    } catch (error) {
      setIsLoading(false);
      console.error("EmailJS error:", error);
      showAlertMessage("danger", getEmailErrorMessage(error));
    }
  };

  return (
    <section id="contact" className="relative flex items-center c-space section-spacing">
      <Particles
        className="absolute inset-0 -z-50"
        quantity={62}
        ease={80}
        color={"#f0f0f0"}
      />
      {showAlert && <Alert type={alertType} text={alertMessage} />}
      <div className="flex flex-col items-center justify-center max-w-md p-5 mx-auto border border-white/10 rounded-2xl bg-primary">
        <div className="flex flex-col items-start w-full gap-5 mb-10">
          <h2 className="text-heading">Let's Talk</h2>
          <p className="font-normal text-neutral-400">
            Whether you're looking to build a new website, improve your existing
            platform, or bring a unique project to life, I'm here to help.
          </p>
        </div>
        <form className="w-full" onSubmit={handleSubmit}>
          <div className="mb-5">
            <label htmlFor="name" className="field-label">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              className="field-input field-input-focus"
              placeholder="Diff"
              autoComplete="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-5">
            <label htmlFor="email" className="field-label">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="field-input field-input-focus"
              placeholder="Diff@email.com"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-5">
            <label htmlFor="message" className="field-label">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              type="text"
              rows="4"
              className="field-input field-input-focus"
              placeholder="Let's talk about your project..."
              value={formData.message}
              onChange={handleChange}
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-1 py-3 text-lg text-center rounded-md cursor-pointer bg-gradient-to-r from-white to-neutral-400 text-primary hover-animation"
          >
            {!isLoading ? "Send" : "Sending..."}
          </button>
        </form>
        <p className="mt-4 text-xs text-neutral-400">
          Prefer direct email?{" "}
          <a
            href={`mailto:${DIRECT_EMAIL}`}
            className="text-white underline decoration-white/50 underline-offset-2"
          >
            {DIRECT_EMAIL}
          </a>
        </p>
      </div>
    </section>
  );
};

export default Contact;
