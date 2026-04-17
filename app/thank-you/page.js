"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ThankYouContent() {
  const params = useSearchParams();
  const name = params.get("name") || "Friend";
  const experience = params.get("experience") || "our honeymoon";

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #F7FAF5 0%, #F2F6EF 30%, #FBF5F4 60%, #F7FAF5 100%)",
        fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div style={{ textAlign: "center", maxWidth: 480 }}>
        <p
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 42,
            fontStyle: "italic",
            fontWeight: 300,
            color: "#2C3E2D",
            margin: "0 0 8px",
          }}
        >
          Thank you
        </p>
        <p
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 28,
            fontWeight: 500,
            color: "#5B7B5E",
            margin: "0 0 24px",
          }}
        >
          {name}
        </p>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            justifyContent: "center",
            margin: "0 0 24px",
          }}
        >
          <div
            style={{
              width: 36,
              height: 1,
              background: "rgba(91,123,94,0.2)",
            }}
          />
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M7 0.5C7 0.5 8.5 4.5 7 7C5.5 4.5 7 0.5 7 0.5Z"
              fill="#C4908B"
              opacity="0.5"
            />
            <path
              d="M7 13.5C7 13.5 8.5 9.5 7 7C5.5 9.5 7 13.5 7 13.5Z"
              fill="#5B7B5E"
              opacity="0.4"
            />
            <path
              d="M0.5 7C0.5 7 4.5 5.5 7 7C4.5 8.5 0.5 7 0.5 7Z"
              fill="#5B7B5E"
              opacity="0.4"
            />
            <path
              d="M13.5 7C13.5 7 9.5 5.5 7 7C9.5 8.5 13.5 7 13.5 7Z"
              fill="#C4908B"
              opacity="0.5"
            />
          </svg>
          <div
            style={{
              width: 36,
              height: 1,
              background: "rgba(91,123,94,0.2)",
            }}
          />
        </div>

        <p
          style={{
            fontSize: 16,
            lineHeight: 1.7,
            color: "#4A6B4D",
            margin: "0 0 12px",
          }}
        >
          Your generous contribution toward {experience} means more to us than
          you know. We can't wait to share photos from Slovenia with you.
        </p>

        <p
          style={{
            fontSize: 14,
            fontStyle: "italic",
            color: "#C4908B",
            margin: "0 0 32px",
          }}
        >
          We look forward to celebrating with you at Brympton House.
        </p>

        <a
          href="https://bertieanddaia.squarespace.com"
          style={{
            display: "inline-block",
            padding: "11px 28px",
            background: "#5B7B5E",
            color: "#F7FAF5",
            borderRadius: 100,
            fontSize: 13,
            fontWeight: 500,
            textDecoration: "none",
            letterSpacing: "0.04em",
          }}
        >
          Back to our Wedding Site
        </a>

        <p
          style={{
            fontSize: 15,
            color: "#6B8A6E",
            lineHeight: 1.7,
            marginTop: 40,
          }}
        >
          With love,
          <br />
          <span
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 22,
              fontStyle: "italic",
              color: "#3D5A40",
            }}
          >
            D & B
          </span>
        </p>
      </div>
    </div>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "'DM Sans', sans-serif",
            color: "#6B8A6E",
          }}
        >
          Loading...
        </div>
      }
    >
      <ThankYouContent />
    </Suspense>
  );
}
