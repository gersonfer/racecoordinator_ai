package com.antigravity.race;

import java.util.List;

public class Heat extends ServerToClientObject {
  private int heatNumber;
  private List<DriverHeatData> drivers;
  private HeatStandings heatStandings;

  public Heat(int heatNumber, List<DriverHeatData> drivers, com.antigravity.models.HeatScoring scoring) {
    super();
    this.heatNumber = heatNumber;
    this.drivers = drivers;
    com.antigravity.models.HeatScoring safeScoring = scoring != null ? scoring
        : new com.antigravity.models.HeatScoring();
    this.heatStandings = new HeatStandings(drivers, safeScoring);
  }

  public Heat() {
    super();
  }

  public void initializeStandings(com.antigravity.models.HeatScoring scoring) {
    com.antigravity.models.HeatScoring safeScoring = scoring != null ? scoring
        : new com.antigravity.models.HeatScoring();
    this.heatStandings = new HeatStandings(this.drivers, safeScoring);
  }

  public int getHeatNumber() {
    return heatNumber;
  }

  public List<DriverHeatData> getDrivers() {
    return drivers;
  }

  @com.fasterxml.jackson.annotation.JsonIgnore
  public List<String> getStandings() {
    return heatStandings != null ? heatStandings.getStandings() : new java.util.ArrayList<>();
  }

  @com.fasterxml.jackson.annotation.JsonIgnore
  public HeatStandings getHeatStandings() {
    return heatStandings;
  }

  public void setHeatNumber(int heatNumber) {
    this.heatNumber = heatNumber;
  }
}
