import React from "react";

function AboutPage() {
  const styles = {
    container: {
      maxWidth: "800px",
      margin: "0 auto",
      padding: "20px",
      color: "#333",
    },
    header1: {
      textAlign: "center",
      color: "#2c3e50",
    },
    header2: {
      color: "#34495e",
      marginTop: "20px",
    },
    paragraph: {
      lineHeight: "1.6",
      marginBottom: "20px",
    },
    lastParagraph: {
      lineHeight: "1.6",
      marginBottom: "0",
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header1}>About PollZone</h1>
      <p style={styles.paragraph}>
        Welcome to PollZone! Our platform allows creators to launch their
        products or projects and let fans decide which options should be
        implemented or go into pre-sale.
      </p>
      <h2 style={styles.header2}>For Fans</h2>
      <p style={styles.paragraph}>
        As a fan, you can explore various projects, vote on your favorite
        options, and see a personalized dashboard with the projects you’ve
        interacted with.
      </p>
      <h2 style={styles.header2}>For Creators</h2>
      <p style={styles.paragraph}>
        As a creator, you can create projects with multiple options, set voting
        timers, and view detailed analytics on fan engagement and voting
        patterns. Your dashboard will show your active and completed projects,
        giving you all the tools you need to succeed.
      </p>
      <h2 style={styles.header2}>Explore and Join Us!</h2>
      <p style={styles.lastParagraph}>
        Feel free to explore different projects and creators to get a feel for
        our community. When you’re ready, sign up to get full access to all
        features.
      </p>
    </div>
  );
}

export default AboutPage;
