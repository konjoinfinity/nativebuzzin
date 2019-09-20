// Exported AlertHelper for usage within the App
export class AlertHelper {
    static dropDown;
    static onClose;

    // Defines the dropdown for usage
    static setDropDown(dropDown) {
        this.dropDown = dropDown
    }

    // Defines the dropdown passing in the type (warn, success, error), title (text), and message (text) to be used in the dropdown
    static show(type, title, message) {
        if (this.dropDown) {
            this.dropDown.alertWithType(type, title, message)
        }
    }

    // Defines the onClose method for usage
    static setOnClose(onClose) {
        this.onClose = onClose
    }

    // Defines the close method for the dropdown if pressed, the dropdown will close
    static invokeOnClose() {
        if (typeof this.onClose === 'function') {
            this.onClose()
        }
    }
}