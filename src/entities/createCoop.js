export function createCoop(settings) {
  return {
    x: 790,
    y: 230,
    width: 210,
    height: 160,
    requiredStayTime: settings.coopRequiredStayTime,
    closed: true,
    gateSide: "left",
    gateWidth: settings.coopGateWidth,
    wallThickness: settings.coopWallThickness,
    gateSlide: 1
  };
}
