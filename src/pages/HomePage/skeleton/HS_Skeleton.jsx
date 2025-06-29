import React from "react";
import { Row, Col, Card } from "react-bootstrap";
import "./HS_Skeleton.css";

const HeroSectionSkeleton = () => {
  return (
    <section className="hero-section">
      <div className="px-0">
        <Row className="g-0 hero-skeleton-section">
          {/* Large Skeleton Card - Left Side */}
          <Col lg={8}>
            <Card className="hero-skeleton-card text-white position-relative overflow-hidden">
              {/* Skeleton Background */}
              <div className="position-absolute top-0 start-0 w-100 h-100 skeleton-bg" />

              <Card.Body className="hero-skeleton-body">
                {/* Skeleton Rating Badge */}
                <div className="align-self-start">
                  <div className="skeleton-element skeleton-rating-badge" />
                </div>

                {/* Skeleton Content */}
                <div>
                  {/* Skeleton Title */}
                  <div className="mb-3">
                    <div className="skeleton-element skeleton-title-large" />
                    <div className="skeleton-element skeleton-title-medium" />
                  </div>

                  {/* Skeleton Metadata */}
                  <div className="mb-3">
                    <div className="skeleton-metadata">
                      <div className="skeleton-element skeleton-meta-stars" />
                      <div className="skeleton-element skeleton-meta-genre" />
                      <div className="skeleton-element skeleton-meta-year" />
                    </div>
                  </div>

                  {/* Skeleton Description */}
                  <div className="skeleton-description">
                    <div className="skeleton-element skeleton-description-line" />
                    <div className="skeleton-element skeleton-description-line" />
                    <div className="skeleton-element skeleton-description-line" />
                    <div className="skeleton-element skeleton-description-line" />
                  </div>

                  {/* Skeleton Button */}
                  <div className="skeleton-element skeleton-button" />
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Right Side Skeletons - 3 Movies */}
          <Col lg={4}>
            <div className="h-100 d-flex flex-column">
              {/* Top Skeleton Movie */}
              <Card
                className="skeleton-small-card text-white position-relative overflow-hidden"
                style={{ height: "50%" }}
              >
                <div className="position-absolute top-0 start-0 w-100 h-100 skeleton-bg" />

                <Card.Body className="skeleton-small-body">
                  <div className="skeleton-element skeleton-small-rating align-self-start" />

                  <div>
                    <div className="skeleton-element skeleton-small-title" />
                    <div className="skeleton-element skeleton-small-meta" />
                    <div className="skeleton-element skeleton-small-button" />
                  </div>
                </Card.Body>
              </Card>

              {/* Bottom Two Skeleton Movies */}
              <Row className="flex-grow-1 g-0 h-50">
                {[...Array(2)].map((_, index) => (
                  <Col xs={6} key={index}>
                    <Card className="skeleton-small-card h-100 text-white position-relative overflow-hidden">
                      <div className="position-absolute top-0 start-0 w-100 h-100 skeleton-bg" />

                      <Card.Body className="skeleton-small-body">
                        <div className="skeleton-element skeleton-tiny-rating align-self-start" />

                        <div>
                          <div className="skeleton-element skeleton-tiny-title" />
                          <div className="skeleton-element skeleton-tiny-meta-line" />
                          <div className="skeleton-element skeleton-tiny-meta-short" />
                          <div className="skeleton-element skeleton-tiny-button" />
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
