import React from "react";
import { Row, Col, Card, Badge } from "react-bootstrap";

const HeroSectionSkeleton = () => {
  return (
    <section className="hero-section">
      <div className="px-0">
        <Row className="g-0" style={{ height: "80vh" }}>
          {/* Large Skeleton Card - Left Side */}
          <Col lg={8}>
            <Card
              className="h-100 bg-dark text-white border-0 position-relative overflow-hidden"
              style={{ borderRadius: "15px" }}
            >
              {/* Skeleton Background */}
              <div
                className="position-absolute top-0 start-0 w-100 h-100 skeleton-bg"
                style={{
                  background:
                    "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)",
                  backgroundSize: "400% 400%",
                  animation: "shimmer 2s ease-in-out infinite",
                }}
              />

              <Card.Body className="p-4 d-flex flex-column justify-content-between h-100 position-relative">
                {/* Skeleton Rating Badge */}
                <div className="align-self-start">
                  <div
                    className="skeleton-element"
                    style={{
                      width: "80px",
                      height: "50px",
                      borderRadius: "50px",
                      backgroundColor: "#333",
                    }}
                  />
                </div>

                {/* Skeleton Content */}
                <div>
                  {/* Skeleton Title */}
                  <div className="mb-3">
                    <div
                      className="skeleton-element mb-2"
                      style={{
                        width: "60%",
                        height: "3rem",
                        backgroundColor: "#333",
                        borderRadius: "8px",
                      }}
                    />
                    <div
                      className="skeleton-element"
                      style={{
                        width: "40%",
                        height: "3rem",
                        backgroundColor: "#333",
                        borderRadius: "8px",
                      }}
                    />
                  </div>

                  {/* Skeleton Metadata */}
                  <div className="mb-3">
                    <div className="d-flex gap-3 mb-2">
                      <div
                        className="skeleton-element"
                        style={{
                          width: "120px",
                          height: "20px",
                          backgroundColor: "#333",
                          borderRadius: "4px",
                        }}
                      />
                      <div
                        className="skeleton-element"
                        style={{
                          width: "80px",
                          height: "20px",
                          backgroundColor: "#333",
                          borderRadius: "4px",
                        }}
                      />
                      <div
                        className="skeleton-element"
                        style={{
                          width: "100px",
                          height: "20px",
                          backgroundColor: "#333",
                          borderRadius: "4px",
                        }}
                      />
                    </div>
                  </div>

                  {/* Skeleton Description */}
                  <div className="mb-4">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className="skeleton-element mb-2"
                        style={{
                          width: i === 3 ? "70%" : "100%",
                          height: "20px",
                          backgroundColor: "#333",
                          borderRadius: "4px",
                        }}
                      />
                    ))}
                  </div>

                  {/* Skeleton Button */}
                  <div
                    className="skeleton-element"
                    style={{
                      width: "150px",
                      height: "50px",
                      backgroundColor: "#333",
                      borderRadius: "25px",
                    }}
                  />
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Right Side Skeletons - 3 Movies */}
          <Col lg={4}>
            <div className="h-100 d-flex flex-column">
              {/* Top Skeleton Movie */}
              <Card
                className="text-white border-0 position-relative overflow-hidden"
                style={{
                  height: "50%",
                  borderRadius: "0",
                }}
              >
                <div
                  className="position-absolute top-0 start-0 w-100 h-100 skeleton-bg"
                  style={{
                    background:
                      "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)",
                    backgroundSize: "400% 400%",
                    animation: "shimmer 2s ease-in-out infinite",
                  }}
                />

                <Card.Body className="p-3 d-flex flex-column justify-content-between h-100 position-relative">
                  <div
                    className="skeleton-element align-self-start"
                    style={{
                      width: "60px",
                      height: "30px",
                      backgroundColor: "#333",
                      borderRadius: "15px",
                    }}
                  />

                  <div>
                    <div
                      className="skeleton-element mb-2"
                      style={{
                        width: "80%",
                        height: "24px",
                        backgroundColor: "#333",
                        borderRadius: "4px",
                      }}
                    />
                    <div
                      className="skeleton-element mb-2"
                      style={{
                        width: "100%",
                        height: "16px",
                        backgroundColor: "#333",
                        borderRadius: "4px",
                      }}
                    />
                    <div
                      className="skeleton-element"
                      style={{
                        width: "90px",
                        height: "32px",
                        backgroundColor: "#333",
                        borderRadius: "4px",
                      }}
                    />
                  </div>
                </Card.Body>
              </Card>

              {/* Bottom Two Skeleton Movies */}
              <Row className="flex-grow-1 g-0 h-50">
                {[...Array(2)].map((_, index) => (
                  <Col xs={6} key={index}>
                    <Card
                      className="h-100 text-white border-0 position-relative overflow-hidden"
                      style={{ borderRadius: "0" }}
                    >
                      <div
                        className="position-absolute top-0 start-0 w-100 h-100 skeleton-bg"
                        style={{
                          background:
                            "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)",
                          backgroundSize: "400% 400%",
                          animation: "shimmer 2s ease-in-out infinite",
                        }}
                      />

                      <Card.Body className="p-3 d-flex flex-column justify-content-between h-100 position-relative">
                        <div
                          className="skeleton-element align-self-start"
                          style={{
                            width: "50px",
                            height: "25px",
                            backgroundColor: "#333",
                            borderRadius: "12px",
                          }}
                        />

                        <div>
                          <div
                            className="skeleton-element mb-2"
                            style={{
                              width: "90%",
                              height: "20px",
                              backgroundColor: "#333",
                              borderRadius: "4px",
                            }}
                          />
                          <div
                            className="skeleton-element mb-2"
                            style={{
                              width: "100%",
                              height: "12px",
                              backgroundColor: "#333",
                              borderRadius: "4px",
                            }}
                          />
                          <div
                            className="skeleton-element mb-1"
                            style={{
                              width: "70%",
                              height: "12px",
                              backgroundColor: "#333",
                              borderRadius: "4px",
                            }}
                          />
                          <div
                            className="skeleton-element"
                            style={{
                              width: "70px",
                              height: "24px",
                              backgroundColor: "#333",
                              borderRadius: "4px",
                            }}
                          />
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          </Col>
        </Row>
      </div>
    </section>
  );
};

export default HeroSectionSkeleton;
