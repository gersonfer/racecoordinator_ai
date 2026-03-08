package com.antigravity.protocols.arduino;

import java.util.List;

import com.antigravity.proto.PinBehavior;
import java.util.Map;
import java.util.HashMap;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class ArduinoConfig {
  public enum PinMode {
    READ,
    WRITE,
    READ_ANALOG
  }

  public enum LapPinPitBehavior {
    NONE(0),
    PIT_IN(1),
    PIT_OUT(2);

    private final int value;

    LapPinPitBehavior(int value) {
      this.value = value;
    }

    public int getValue() {
      return value;
    }
  }

  private static final Map<Integer, PinMode> PIN_MODE_MAP = new HashMap<>();
  public static final int MAX_LANES = 64;

  static {
    PIN_MODE_MAP.put(PinBehavior.BEHAVIOR_CALL_BUTTON.getNumber(), PinMode.READ);
    PIN_MODE_MAP.put(PinBehavior.BEHAVIOR_RELAY.getNumber(), PinMode.WRITE);

    for (int i = 0; i < MAX_LANES; i++) {
      PIN_MODE_MAP.put(PinBehavior.BEHAVIOR_LAP_BASE.getNumber() + i, PinMode.READ);
      PIN_MODE_MAP.put(PinBehavior.BEHAVIOR_SEGMENT_BASE.getNumber() + i, PinMode.READ);
      PIN_MODE_MAP.put(PinBehavior.BEHAVIOR_CALL_BUTTON_BASE.getNumber() + i, PinMode.READ);
      PIN_MODE_MAP.put(PinBehavior.BEHAVIOR_RELAY_BASE.getNumber() + i, PinMode.WRITE);
      PIN_MODE_MAP.put(PinBehavior.BEHAVIOR_PIT_IN_BASE.getNumber() + i, PinMode.READ);
      PIN_MODE_MAP.put(PinBehavior.BEHAVIOR_PIT_OUT_BASE.getNumber() + i, PinMode.READ);
      PIN_MODE_MAP.put(PinBehavior.BEHAVIOR_VOLTAGE_LEVEL_BASE.getNumber() + i, PinMode.READ_ANALOG);
    }
  }

  public static PinMode getPinMode(int id) {
    return PIN_MODE_MAP.get(id);
  }

  public static boolean isReadPin(int id) {
    return getPinMode(id) == PinMode.READ;
  }

  public static boolean isWritePin(int id) {
    return getPinMode(id) == PinMode.WRITE;
  }

  public String name;
  public String commPort;
  public int baudRate;
  public int debounceUs;

  public boolean globalInvertLanes;
  public boolean normallyClosedRelays;
  public int globalInvertLights;
  public boolean usePitsAsLaps;
  public boolean useLapsForSegments;
  public LapPinPitBehavior lapPinPitBehavior;

  public int hardwareType;

  public List<Integer> digitalIds;
  public List<Integer> analogIds;
  public List<LedString> ledStrings;
  public List<String> ledLaneColorOverrides;
  public Map<String, Integer> voltageConfigs = new HashMap<>();

  public static final int MAX_DIGITAL_PINS = 60;
  public static final int MAX_ANALOG_PINS = 16;

  public ArduinoConfig() {
    this.digitalIds = new java.util.ArrayList<>();
    for (int i = 0; i < MAX_DIGITAL_PINS; i++) {
      this.digitalIds.add(PinBehavior.BEHAVIOR_UNUSED.getNumber());
    }
    this.analogIds = new java.util.ArrayList<>();
    for (int i = 0; i < MAX_ANALOG_PINS; i++) {
      this.analogIds.add(PinBehavior.BEHAVIOR_UNUSED.getNumber());
    }
    this.ledStrings = new java.util.ArrayList<>();
    this.ledLaneColorOverrides = new java.util.ArrayList<>();
    this.voltageConfigs = new HashMap<>();

    this.baudRate = 115200;

    // None of this is supported yet
    this.debounceUs = 200;
    this.hardwareType = 1;
    this.globalInvertLanes = false;
    this.normallyClosedRelays = true;
    this.globalInvertLights = 0;
    this.usePitsAsLaps = false;
    this.useLapsForSegments = true;
    this.lapPinPitBehavior = LapPinPitBehavior.PIT_OUT;
  }

  @org.bson.codecs.pojo.annotations.BsonCreator
  @com.fasterxml.jackson.annotation.JsonCreator
  public ArduinoConfig(
      @org.bson.codecs.pojo.annotations.BsonProperty("name") @com.fasterxml.jackson.annotation.JsonProperty("name") String name,
      @org.bson.codecs.pojo.annotations.BsonProperty("commPort") @com.fasterxml.jackson.annotation.JsonProperty("commPort") String commPort,
      @org.bson.codecs.pojo.annotations.BsonProperty("baudRate") @com.fasterxml.jackson.annotation.JsonProperty("baudRate") int baudRate,
      @org.bson.codecs.pojo.annotations.BsonProperty("debounceUs") @com.fasterxml.jackson.annotation.JsonProperty("debounceUs") int debounceUs,
      @org.bson.codecs.pojo.annotations.BsonProperty("hardwareType") @com.fasterxml.jackson.annotation.JsonProperty("hardwareType") int hardwareType,
      @org.bson.codecs.pojo.annotations.BsonProperty("globalInvertLanes") @com.fasterxml.jackson.annotation.JsonProperty("globalInvertLanes") boolean globalInvertLanes,
      @org.bson.codecs.pojo.annotations.BsonProperty("normallyClosedRelays") @com.fasterxml.jackson.annotation.JsonProperty("normallyClosedRelays") boolean normallyClosedRelays,
      @org.bson.codecs.pojo.annotations.BsonProperty("globalInvertLights") @com.fasterxml.jackson.annotation.JsonProperty("globalInvertLights") int globalInvertLights,
      @org.bson.codecs.pojo.annotations.BsonProperty("usePitsAsLaps") @com.fasterxml.jackson.annotation.JsonProperty("usePitsAsLaps") boolean usePitsAsLaps,
      @org.bson.codecs.pojo.annotations.BsonProperty("useLapsForSegments") @com.fasterxml.jackson.annotation.JsonProperty("useLapsForSegments") boolean useLapsForSegments,
      @org.bson.codecs.pojo.annotations.BsonProperty("lapPinPitBehavior") @com.fasterxml.jackson.annotation.JsonProperty("lapPinPitBehavior") LapPinPitBehavior lapPinPitBehavior,
      @org.bson.codecs.pojo.annotations.BsonProperty("digitalIds") @com.fasterxml.jackson.annotation.JsonProperty("digitalIds") List<Integer> digitalIds,
      @org.bson.codecs.pojo.annotations.BsonProperty("analogIds") @com.fasterxml.jackson.annotation.JsonProperty("analogIds") List<Integer> analogIds,
      @org.bson.codecs.pojo.annotations.BsonProperty("ledStrings") @com.fasterxml.jackson.annotation.JsonProperty("ledStrings") List<LedString> ledStrings,
      @org.bson.codecs.pojo.annotations.BsonProperty("ledLaneColorOverrides") @com.fasterxml.jackson.annotation.JsonProperty("ledLaneColorOverrides") List<String> ledLaneColorOverrides,
      @org.bson.codecs.pojo.annotations.BsonProperty("voltageConfigs") @com.fasterxml.jackson.annotation.JsonProperty("voltageConfigs") java.util.Map<String, Integer> voltageConfigs) {
    this.name = name;
    this.commPort = commPort;
    this.baudRate = baudRate;
    this.debounceUs = debounceUs;
    this.hardwareType = hardwareType;
    this.globalInvertLanes = globalInvertLanes;
    this.normallyClosedRelays = normallyClosedRelays;
    this.globalInvertLights = globalInvertLights;
    this.usePitsAsLaps = usePitsAsLaps;
    this.useLapsForSegments = useLapsForSegments;
    this.lapPinPitBehavior = lapPinPitBehavior;
    this.digitalIds = digitalIds;
    this.analogIds = analogIds;
    this.ledStrings = ledStrings;
    this.ledLaneColorOverrides = ledLaneColorOverrides;
    this.voltageConfigs = voltageConfigs;
  }
}
