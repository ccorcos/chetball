// https://stackoverflow.com/questions/22769111/add-entry-to-ios-plist-file-via-cordova-config-xml

var fs = require("fs") // nodejs.org/api/fs.html
var plist = require("plist") // www.npmjs.com/package/plist

var FILEPATH = "./platforms/ios/ChetBall/ChetBall-Info.plist"

var xml = fs.readFileSync(FILEPATH, "utf8")
var obj = plist.parse(xml)

obj.NSPhotoLibraryUsageDescription =
	"To upload an image that is used for the balls."
obj.NSCameraUsageDescription = "To upload an image that is used for the balls."

xml = plist.build(obj)
fs.writeFileSync(FILEPATH, xml, { encoding: "utf8" })
