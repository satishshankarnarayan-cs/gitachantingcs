"use client";

import React, { useMemo, useState } from "react";

type Participant = {
  name: string;
  category: string;
};

type VerseState = {
  memoryMistakes: string;
  pronunciationMistakes: string;
};

type ComprehensionState = {
  score: string;
  notes: string;
};



type SubmissionPayload = {
  timestamp: string;
  participantName: string;
  category: string;
  versesAttempted: number;
  totalMemoryMistakes: number;
  totalPronunciationMistakes: number;
  comprehensionMistakes: number;
};

type Stage = "login" | "participant" | "verse" | "comprehensionPrompt" | "comprehension";

type VerseCard = {
  id: number;
  title: string;
  slideImage: string;
  kind: "scored";
};

const categories = ["Memory Child", "Reading", "Memory"];
const numberOptions = ["0", "1", "2", "3", "4"];
const comprehensionOptions = ["Correct", "Incorrect"];
const TOTAL_ITEMS = 23;
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxs_oFl-OR8477CZZqmuHgEFlEBnn603DEkOrOZ7CS-NAGi2chA5Z-UACkyeUgVgZAj/exec";

const verseCards: VerseCard[] = [
  { id: 0, title: "Intro Verse", slideImage: "/gitaslides/IntroVerse.png", kind: "scored" },
  { id: 1, title: "Verse 1", slideImage: "/gitaslides/Verse1.png", kind: "scored" },
  { id: 2, title: "Verse 2", slideImage: "/gitaslides/Verse2.png", kind: "scored" },
  { id: 3, title: "Verse 3", slideImage: "/gitaslides/Verse3.png", kind: "scored" },
  { id: 4, title: "Verse 4", slideImage: "/gitaslides/Verse4.png", kind: "scored" },
  { id: 5, title: "Verse 5", slideImage: "/gitaslides/Verse5.png", kind: "scored" },
  { id: 6, title: "Verse 6", slideImage: "/gitaslides/Verse6.png", kind: "scored" },
  { id: 7, title: "Verse 7", slideImage: "/gitaslides/Verse7.png", kind: "scored" },
  { id: 8, title: "Verse 8", slideImage: "/gitaslides/Verse8.png", kind: "scored" },
  { id: 9, title: "Verse 9", slideImage: "/gitaslides/Verse9.png", kind: "scored" },
  { id: 10, title: "Verse 10", slideImage: "/gitaslides/Verse10.png", kind: "scored" },
  { id: 11, title: "Verse 11", slideImage: "/gitaslides/Verse11.png", kind: "scored" },
  { id: 12, title: "Verse 12", slideImage: "/gitaslides/Verse12.png", kind: "scored" },
  { id: 13, title: "Verse 13", slideImage: "/gitaslides/Verse13.png", kind: "scored" },
  { id: 14, title: "Verse 14", slideImage: "/gitaslides/Verse14.png", kind: "scored" },
  { id: 15, title: "Verse 15", slideImage: "/gitaslides/Verse15.png", kind: "scored" },
  { id: 16, title: "Verse 16", slideImage: "/gitaslides/Verse16.png", kind: "scored" },
  { id: 17, title: "Verse 17", slideImage: "/gitaslides/Verse17.png", kind: "scored" },
  { id: 18, title: "Verse 18", slideImage: "/gitaslides/Verse18.png", kind: "scored" },
  { id: 19, title: "Verse 19", slideImage: "/gitaslides/Verse19.png", kind: "scored" },
  { id: 20, title: "Verse 20", slideImage: "/gitaslides/Verse20.png", kind: "scored" },
  { id: 21, title: "Concluding Verse", slideImage: "/gitaslides/Concluding-Verse.png", kind: "scored" },
  { id: 22, title: "Chapter 18 Verse 66", slideImage: "/gitaslides/Chapter18-Verse66.png", kind: "scored" },
];

function getFlowItems(category: string): VerseCard[] {
  if (category === "Memory Child") {
    return verseCards.filter((verse) => verse.id <= 8 || verse.id === 21 || verse.id === 22);
  }
  return verseCards;
}

function createInitialVerseState(): Record<number, VerseState> {
  const state: Record<number, VerseState> = {};
  verseCards.forEach((verse) => {
    state[verse.id] = {
      memoryMistakes: "0",
      pronunciationMistakes: "0",
    };
  });
  return state;
}

function createInitialComprehensionState(): Record<number, ComprehensionState> {
  return {
    1: { score: "", notes: "" },
    2: { score: "", notes: "" },
    3: { score: "", notes: "" },
    4: { score: "", notes: "" },
  };
}

function buildSubmissionPayload(
  participant: Participant,
  flowItems: VerseCard[],
  verseScores: Record<number, VerseState>,
  comprehension: Record<number, ComprehensionState>
): SubmissionPayload {
  const scoredItems = flowItems.filter((item) => item.kind === "scored");

  const totalMemoryMistakes = scoredItems.reduce((sum, item) => {
    return sum + Number(verseScores[item.id]?.memoryMistakes || 0);
  }, 0);

  const totalPronunciationMistakes = scoredItems.reduce((sum, item) => {
    return sum + Number(verseScores[item.id]?.pronunciationMistakes || 0);
  }, 0);

  // ✅ Count incorrect answers
  const comprehensionMistakes = Object.values(comprehension).reduce((count, item) => {
    return count + (item.score === "Incorrect" ? 1 : 0);
  }, 0);

  return {
    timestamp: new Date().toISOString(),
    participantName: participant.name,
    category: participant.category,
    versesAttempted: scoredItems.length,
    totalMemoryMistakes,
    totalPronunciationMistakes,
    comprehensionMistakes,
  };
}




async function saveToGoogleSheet(payload: SubmissionPayload): Promise<void> {
  if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL.includes("PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE")) {
    console.warn("Google Apps Script URL not configured.");
    return;
  }

  const response = await fetch(GOOGLE_SCRIPT_URL, {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    },
    body: JSON.stringify(payload),
  });

  void response;
}

const palette = {
  ink: "#5f2400",
  deepBrown: "#6e2f12",
  saffron: "#c9791b",
  saffronDark: "#99540d",
  gold: "#d8a44c",
  cream: "#fbf1df",
  creamDark: "#f1e0bf",
  panel: "rgba(255, 248, 235, 0.96)",
  border: "#c88d34",
  muted: "#8c5d2f",
  slate: "#5d4535",
};

function shellBackground(): React.CSSProperties {
  return {
    minHeight: "100vh",
    padding: 24,
    fontFamily: 'Georgia, "Times New Roman", serif',
    color: palette.ink,
    background:
      "radial-gradient(circle at top left, rgba(255,228,179,0.9), transparent 30%), radial-gradient(circle at top right, rgba(188,108,37,0.3), transparent 22%), linear-gradient(180deg, #f6cf88 0%, #eda64e 35%, #d67a20 100%)",
    position: "relative",
    overflow: "hidden",
  };
}

function outerFrame(): React.CSSProperties {
  return {
    position: "relative",
    maxWidth: 1320,
    margin: "0 auto",
    borderRadius: 38,
    padding: 12,
    background: "linear-gradient(180deg, #f6d28f 0%, #d69d41 20%, #aa620f 100%)",
    boxShadow: "0 18px 50px rgba(102, 48, 4, 0.35)",
  };
}

function innerFrame(): React.CSSProperties {
  return {
    borderRadius: 30,
    padding: 24,
    background:
      "linear-gradient(180deg, rgba(253,244,223,0.98) 0%, rgba(248,231,194,0.98) 100%)",
    border: "3px solid rgba(133, 73, 10, 0.28)",
    position: "relative",
    overflow: "hidden",
  };
}

function decorativeHalo(): React.CSSProperties {
  return {
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
    background:
      "radial-gradient(circle at 15% 12%, rgba(255,255,255,0.75), transparent 18%), radial-gradient(circle at 82% 12%, rgba(140,54,0,0.18), transparent 14%), radial-gradient(circle at 80% 70%, rgba(194,110,29,0.12), transparent 20%), radial-gradient(circle at 15% 82%, rgba(255,241,205,0.32), transparent 18%)",
  };
}

function titleBanner(): React.CSSProperties {
  return {
    background: "linear-gradient(180deg, #fff6ea 0%, #f6e2be 100%)",
    border: `2px solid ${palette.border}`,
    borderRadius: 28,
    padding: "18px 26px",
    textAlign: "center",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.8), 0 8px 24px rgba(169,96,14,0.12)",
  };
}

function leftPanelStyle(): React.CSSProperties {
  return {
    background: "linear-gradient(180deg, rgba(255,247,233,0.96) 0%, rgba(248,230,197,0.95) 100%)",
    border: `2px solid ${palette.border}`,
    borderRadius: 26,
    padding: 22,
    boxShadow: "0 10px 26px rgba(147, 77, 11, 0.12)",
    position: "relative",
    zIndex: 1,
  };
}

function cardStyle(): React.CSSProperties {
  return {
    background: "linear-gradient(180deg, rgba(255,250,242,0.98) 0%, rgba(247,233,203,0.98) 100%)",
    border: `2px solid ${palette.border}`,
    borderRadius: 26,
    padding: 28,
    boxShadow: "0 14px 34px rgba(133, 73, 10, 0.14)",
    position: "relative",
    zIndex: 1,
  };
}

function inputStyle(): React.CSSProperties {
  return {
    width: "100%",
    padding: "14px 16px",
    borderRadius: 16,
    border: `1.5px solid ${palette.border}`,
    fontSize: 16,
    marginTop: 8,
    background: "rgba(255,252,247,0.95)",
    color: palette.deepBrown,
    outline: "none",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.65)",
  };
}

function primaryButtonStyle(disabled = false): React.CSSProperties {
  return {
    padding: "13px 24px",
    borderRadius: 999,
    border: "none",
    background: disabled
      ? "linear-gradient(180deg, #d7b07b 0%, #b88b54 100%)"
      : "linear-gradient(180deg, #d88f2c 0%, #b56610 100%)",
    color: "#fffaf1",
    fontSize: 16,
    fontWeight: 700,
    cursor: disabled ? "not-allowed" : "pointer",
    boxShadow: disabled ? "none" : "0 10px 18px rgba(146, 79, 9, 0.22)",
    letterSpacing: 0.2,
  };
}

function secondaryButtonStyle(disabled = false): React.CSSProperties {
  return {
    padding: "13px 22px",
    borderRadius: 999,
    border: `1.5px solid ${palette.border}`,
    background: disabled ? "rgba(237, 215, 182, 0.6)" : "rgba(255, 249, 239, 0.92)",
    color: disabled ? "#aa865e" : palette.deepBrown,
    fontSize: 16,
    fontWeight: 700,
    cursor: disabled ? "not-allowed" : "pointer",
  };
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "inline-block",
        padding: "8px 16px",
        borderRadius: 999,
        background: "linear-gradient(180deg, #faead1 0%, #f3d5a0 100%)",
        border: `1px solid ${palette.border}`,
        color: palette.deepBrown,
        fontSize: 13,
        fontWeight: 700,
        letterSpacing: 1,
        textTransform: "uppercase",
      }}
    >
      {children}
    </div>
  );
}

export default function Page() {
  const [stage, setStage] = useState<Stage>("login");
  const [participant, setParticipant] = useState<Participant>({ name: "", category: "" });
  const [verseIndex, setVerseIndex] = useState(0);
  const [verseScores, setVerseScores] = useState<Record<number, VerseState>>(createInitialVerseState());
  const [attemptComprehension, setAttemptComprehension] = useState("");
  const [comprehensionIndex, setComprehensionIndex] = useState(1);
  const [comprehension, setComprehension] = useState<Record<number, ComprehensionState>>(createInitialComprehensionState());
  const [lastCompleted, setLastCompleted] = useState("");
  const [saveStatus, setSaveStatus] = useState("");
  

  const flowItems = useMemo(() => getFlowItems(participant.category), [participant.category]);
  const totalItems = flowItems.length;
  const currentVerse = flowItems[verseIndex];
  const isReading = participant.category === "Reading";
  const isScoredVerse = currentVerse?.kind === "scored";

  const progress = useMemo(() => {
    if (stage === "login") return 5;
    if (stage === "participant") return 12;
    if (stage === "verse") return 12 + ((verseIndex + 1) / totalItems) * 58;
    if (stage === "comprehensionPrompt") return 74;
    if (stage === "comprehension") return 74 + (comprehensionIndex / 4) * 20;
    return 0;
  }, [stage, verseIndex, comprehensionIndex, totalItems]);

  function resetFlow() {
    setStage("login");
    setParticipant({ name: "", category: "" });
    setVerseIndex(0);
    setVerseScores(createInitialVerseState());
    setAttemptComprehension("");
    setComprehensionIndex(1);
    setComprehension(createInitialComprehensionState());
    setLastCompleted("");
  }

  async function finishAndReturn() {
    const payload = buildSubmissionPayload(participant, flowItems, verseScores, comprehension);

    try {
      setSaveStatus("Saving results to Google Sheet...");
      await saveToGoogleSheet(payload);
      setSaveStatus("Saved to Google Sheet.");
    } catch (error) {
      console.error(error);
      setSaveStatus("Could not save to Google Sheet. Please check the Apps Script URL.");
    }

    setLastCompleted(participant.name ? `${participant.name} (${participant.category})` : "Completed");
    setParticipant({ name: "", category: "" });
    setVerseIndex(0);
    setAttemptComprehension("");
    setComprehensionIndex(1);
    setComprehension(createInitialComprehensionState());
    setStage("participant");
  }

  return (
    <div style={shellBackground()}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(104,52,10,0.05) 0%, rgba(104,52,10,0.18) 100%), url('/chinmaya-bg.png') right top / 340px auto no-repeat",
          opacity: 0.95,
          pointerEvents: "none",
        }}
      />

      <div style={outerFrame()}>
        <div style={innerFrame()}>
          <div style={decorativeHalo()} />

          <div style={{ ...titleBanner(), marginBottom: 24, position: "relative", zIndex: 1 }}>
            <div style={{ fontSize: 52, lineHeight: 1, marginBottom: 10, color: palette.saffronDark }}>ॐ</div>
            <div style={{ fontSize: 34, fontWeight: 700, color: palette.deepBrown }}>Śrīmad-Bhagavad-Gītā</div>
            <div style={{ fontSize: 17, color: palette.muted, marginTop: 8, letterSpacing: 1.4 }}>
              Chapter 12 • Bhakti Yoga • Chanting Assessment
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "320px 1fr",
              gap: 24,
              alignItems: "start",
              position: "relative",
              zIndex: 1,
            }}
          >
            <div style={leftPanelStyle()}>
              <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 6 }}>Geeta Chanting</div>
              <div style={{ color: palette.muted, marginBottom: 22 }}>Chinmaya-style devotional theme</div>

              <div style={{ marginBottom: 22 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 8 }}>
                  <span style={{ color: palette.muted }}>Progress</span>
                  <span style={{ fontWeight: 700 }}>{Math.round(progress)}%</span>
                </div>
                <div
                  style={{
                    height: 12,
                    borderRadius: 999,
                    background: "rgba(174, 115, 31, 0.15)",
                    overflow: "hidden",
                    border: "1px solid rgba(149, 84, 10, 0.14)",
                  }}
                >
                  <div
                    style={{
                      width: `${progress}%`,
                      height: "100%",
                      borderRadius: 999,
                      background: "linear-gradient(90deg, #c66d13 0%, #efb04f 100%)",
                    }}
                  />
                </div>
              </div>

              <div
                style={{
                  background: "rgba(255, 250, 241, 0.88)",
                  border: `1px solid ${palette.border}`,
                  borderRadius: 20,
                  padding: 16,
                  lineHeight: 1.65,
                  color: palette.slate,
                }}
              >
                <div style={{ fontWeight: 700, color: palette.deepBrown, marginBottom: 8 }}>Flow</div>
                <div>
                  {participant.category === "Memory Child"
                    ? "Login → Participant → Intro Verse → Verse 1–8 → Concluding Verse → Chapter 18 Verse 66 → Comprehension → Participant"
                    : "Login → Participant → Intro Verse → Verse 1–20 → Concluding Verse → Chapter 18 Verse 66 → Comprehension → Participant"}
                </div>
              </div>

              {participant.name ? (
                <div
                  style={{
                    marginTop: 16,
                    background: "rgba(255, 247, 232, 0.92)",
                    border: `1px solid ${palette.border}`,
                    borderRadius: 20,
                    padding: 16,
                  }}
                >
                  <div style={{ fontWeight: 700, color: palette.deepBrown }}>Current participant</div>
                  <div style={{ marginTop: 8, fontSize: 18 }}>{participant.name}</div>
                  <div style={{ color: palette.muted }}>{participant.category}</div>
                </div>
              ) : null}

              {lastCompleted ? (
                <div
                  style={{
                    marginTop: 16,
                    background: "linear-gradient(180deg, rgba(255,244,220,0.95) 0%, rgba(247,224,180,0.92) 100%)",
                    border: `1px solid ${palette.border}`,
                    borderRadius: 20,
                    padding: 16,
                  }}
                >
                  <div style={{ fontWeight: 700, color: palette.deepBrown }}>Last completed</div>
                  <div style={{ marginTop: 8 }}>{lastCompleted}</div>
                </div>
              ) : null}

              <button style={{ ...secondaryButtonStyle(false), width: "100%", marginTop: 18 }} onClick={resetFlow}>
                Reset Flow
              </button>

              {saveStatus ? (
                <div
                  style={{
                    marginTop: 16,
                    background: "rgba(255, 250, 241, 0.88)",
                    border: `1px solid ${palette.border}`,
                    borderRadius: 20,
                    padding: 14,
                    color: palette.deepBrown,
                    lineHeight: 1.5,
                  }}
                >
                  {saveStatus}
                </div>
              ) : null}
            </div>

            <div style={cardStyle()}>
              {stage === "login" && (
                <div>
                  <SectionLabel>Welcome</SectionLabel>
                  <h1 style={{ fontSize: 44, margin: "16px 0 10px", color: palette.deepBrown }}>Login Page</h1>
                  <p style={{ color: palette.muted, fontSize: 18, marginBottom: 28 }}>
                    Enter the evaluator details and continue into the chanting flow.
                  </p>

                  <div style={{ maxWidth: 540, display: "grid", gap: 18 }}>
                    <div>
                      <label style={{ fontWeight: 700 }}>Username</label>
                      <input style={inputStyle()} placeholder="Enter username" />
                    </div>
                    <div>
                      <label style={{ fontWeight: 700 }}>Password</label>
                      <input style={inputStyle()} type="password" placeholder="Enter password" />
                    </div>
                    <div style={{ paddingTop: 8 }}>
                      <button style={primaryButtonStyle(false)} onClick={() => setStage("participant")}>
                        Enter App
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {stage === "participant" && (
                <div>
                  <SectionLabel>Participant Setup</SectionLabel>
                  <h1 style={{ fontSize: 42, margin: "16px 0 10px", color: palette.deepBrown }}>Participant Page</h1>
                  <p style={{ color: palette.muted, fontSize: 18, marginBottom: 26 }}>
                    Capture participant details before beginning the chanting assessment.
                  </p>

                  <div style={{ maxWidth: 700, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
                    <div>
                      <label style={{ fontWeight: 700 }}>Participant Name</label>
                      <input
                        style={inputStyle()}
                        value={participant.name}
                        onChange={(e) => setParticipant({ ...participant, name: e.target.value })}
                        placeholder="Enter participant name"
                      />
                    </div>
                    <div>
                      <label style={{ fontWeight: 700 }}>Participant Category</label>
                      <select
                        style={inputStyle()}
                        value={participant.category}
                        onChange={(e) => setParticipant({ ...participant, category: e.target.value })}
                      >
                        <option value="">Select category</option>
                        {categories.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div
                    style={{
                      marginTop: 28,
                      padding: 18,
                      borderRadius: 22,
                      background: "linear-gradient(180deg, rgba(255,245,228,0.95) 0%, rgba(247,229,192,0.95) 100%)",
                      border: `1px solid ${palette.border}`,
                      color: palette.slate,
                      maxWidth: 720,
                    }}
                  >
                    The Reading category hides memory mistakes. Memory Child and Memory show both memory and pronunciation mistakes. Memory Child also uses a shorter chanting flow: Intro Verse, Verse 1–8, Concluding Verse, and Chapter 18 Verse 66. Concluding Verse and Chapter 18 Verse 66 now also accept mistakes like the other chanting items.
                  </div>

                  <div style={{ marginTop: 24 }}>
                    <button
                      style={primaryButtonStyle(!(participant.name && participant.category))}
                      disabled={!participant.name || !participant.category}
                      onClick={() => {
                        setVerseIndex(0);
                        setStage("verse");
                      }}
                    >
                      Start Intro Verse
                    </button>
                  </div>
                </div>
              )}

              {stage === "verse" && currentVerse && (
                <div>
                  <SectionLabel>Chanting Assessment</SectionLabel>
                  <h1 style={{ fontSize: 40, margin: "16px 0 10px", color: palette.deepBrown }}>{currentVerse.title}</h1>
                  <p style={{ color: palette.muted, fontSize: 18, marginBottom: 20 }}>
                    This item uses the matching slide from your zip file. Enter pronunciation mistakes for every item, and memory mistakes for all non-Reading categories.
                  </p>

                  <div
                    style={{
                      marginBottom: 22,
                      background: "linear-gradient(180deg, rgba(255,248,235,0.96) 0%, rgba(244,226,192,0.96) 100%)",
                      border: `2px solid ${palette.border}`,
                      borderRadius: 24,
                      padding: 14,
                      boxShadow: "0 10px 24px rgba(133, 73, 10, 0.12)",
                    }}
                  >
                    <img
                      src={currentVerse.slideImage}
                      alt={currentVerse.title}
                      style={{
                        display: "block",
                        width: "100%",
                        maxHeight: 760,
                        objectFit: "contain",
                        borderRadius: 16,
                        background: "#fff8ee",
                      }}
                    />
                  </div>

                  {isScoredVerse && (
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: isReading ? "1fr" : "1fr 1fr",
                        gap: 18,
                        maxWidth: 800,
                      }}
                    >
                      {!isReading && (
                        <div>
                          <label style={{ fontWeight: 700 }}>Memory Mistake(s)</label>
                          <select
                            style={inputStyle()}
                            value={verseScores[currentVerse.id].memoryMistakes}
                            onChange={(e) =>
                              setVerseScores({
                                ...verseScores,
                                [currentVerse.id]: {
                                  ...verseScores[currentVerse.id],
                                  memoryMistakes: e.target.value,
                                },
                              })
                            }
                          >
                            {numberOptions.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      <div>
                        <label style={{ fontWeight: 700 }}>Pronunciation Mistake(s)</label>
                        <select
                          style={inputStyle()}
                          value={verseScores[currentVerse.id].pronunciationMistakes}
                          onChange={(e) =>
                            setVerseScores({
                              ...verseScores,
                              [currentVerse.id]: {
                                ...verseScores[currentVerse.id],
                                pronunciationMistakes: e.target.value,
                              },
                            })
                          }
                        >
                          {numberOptions.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 16,
                      marginTop: 28,
                      flexWrap: "wrap",
                    }}
                  >
                    <button
                      style={secondaryButtonStyle(verseIndex === 0)}
                      disabled={verseIndex === 0}
                      onClick={() => setVerseIndex(Math.max(0, verseIndex - 1))}
                    >
                      Previous
                    </button>

                    <div
                      style={{
                        padding: "10px 18px",
                        borderRadius: 999,
                        background: "rgba(241, 220, 183, 0.88)",
                        border: `1px solid ${palette.border}`,
                        fontWeight: 700,
                      }}
                    >
                      {verseIndex + 1} / {flowItems.length}
                    </div>

                    <button
                      style={primaryButtonStyle(false)}
                      onClick={() => {
                        if (verseIndex === flowItems.length - 1) {
                          setStage("comprehensionPrompt");
                        } else {
                          setVerseIndex(verseIndex + 1);
                        }
                      }}
                    >
                      {verseIndex === flowItems.length - 1 ? "Continue to Comprehension" : "Next"}
                    </button>
                  </div>
                </div>
              )}

              {stage === "comprehensionPrompt" && (
                <div>
                  <SectionLabel>Comprehension</SectionLabel>
                  <h1 style={{ fontSize: 42, margin: "16px 0 10px", color: palette.deepBrown }}>Comprehension Choice</h1>
                  <p style={{ color: palette.muted, fontSize: 18, marginBottom: 24 }}>
                    Ask whether the participant wants to attempt the comprehension section.
                  </p>

                  <div style={{ display: "grid", gap: 14, maxWidth: 680 }}>
                    {[
                      { value: "yes", label: "Yes, attempt comprehension" },
                      { value: "no", label: "No, return to participant page" },
                    ].map((item) => (
                      <label
                        key={item.value}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          padding: 18,
                          borderRadius: 18,
                          background: "rgba(255, 249, 239, 0.92)",
                          border: `1px solid ${palette.border}`,
                          cursor: "pointer",
                        }}
                      >
                        <input
                          type="radio"
                          name="attempt"
                          value={item.value}
                          checked={attemptComprehension === item.value}
                          onChange={(e) => setAttemptComprehension(e.target.value)}
                        />
                        <span style={{ fontSize: 18 }}>{item.label}</span>
                      </label>
                    ))}
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 28, gap: 16 }}>
                    <button style={secondaryButtonStyle(false)} onClick={() => setStage("verse")}>
                      Previous
                    </button>
                    <button
                      style={primaryButtonStyle(!attemptComprehension)}
                      disabled={!attemptComprehension}
                      onClick={() => {
                        if (attemptComprehension === "yes") {
                          setComprehensionIndex(1);
                          setStage("comprehension");
                        } else {
                          void void finishAndReturn();
                        }
                      }}
                    >
                      Continue
                    </button>
                  </div>
                </div>
              )}

              {stage === "comprehension" && (
                <div>
                  <SectionLabel>Comprehension Assessment</SectionLabel>
                  <h1 style={{ fontSize: 42, margin: "16px 0 10px", color: palette.deepBrown }}>
                    Comprehension {comprehensionIndex}
                  </h1>
                  <p style={{ color: palette.muted, fontSize: 18, marginBottom: 24 }}>
                    Score the comprehension response and add any quick note.
                  </p>

                  <div style={{ maxWidth: 700, display: "grid", gap: 18 }}>
                    <div>
                      <label style={{ fontWeight: 700 }}>Assessment</label>
                      <select
                        style={inputStyle()}
                        value={comprehension[comprehensionIndex].score}
                        onChange={(e) =>
                          setComprehension({
                            ...comprehension,
                            [comprehensionIndex]: {
                              ...comprehension[comprehensionIndex],
                              score: e.target.value,
                            },
                          })
                        }
                      >
                        <option value="">Select assessment</option>
                        {comprehensionOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label style={{ fontWeight: 700 }}>Notes</label>
                      <input
                        style={inputStyle()}
                        value={comprehension[comprehensionIndex].notes}
                        onChange={(e) =>
                          setComprehension({
                            ...comprehension,
                            [comprehensionIndex]: {
                              ...comprehension[comprehensionIndex],
                              notes: e.target.value,
                            },
                          })
                        }
                        placeholder="Optional notes"
                      />
                    </div>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 28, gap: 16 }}>
                    <button
                      style={secondaryButtonStyle(false)}
                      onClick={() => {
                        if (comprehensionIndex === 1) {
                          setStage("comprehensionPrompt");
                        } else {
                          setComprehensionIndex(comprehensionIndex - 1);
                        }
                      }}
                    >
                      Previous
                    </button>
                    <button
                      style={primaryButtonStyle(false)}
                      onClick={() => {
                        if (comprehensionIndex === 4) {
                          void void finishAndReturn();
                        } else {
                          setComprehensionIndex(comprehensionIndex + 1);
                        }
                      }}
                    >
                      {comprehensionIndex === 4 ? "Finish and Return" : "Next"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
