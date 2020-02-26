export class AlertHelper {
    static dropDown;
    static onClose;

    static setDropDown(dropDown) {
        try {
            this.dropDown = dropDown
        } catch (error) {
            console.log(error)
        }
    }

    static show(type, title, message) {
        try {
            if (this.dropDown) {
                this.dropDown.alertWithType(type, title, message)
            }
        } catch (error) {
            console.log(error)
        }
    }

    static setOnClose(onClose) {
        try {
            this.onClose = onClose
        } catch (error) {
            console.log(error)
        }
    }

    static invokeOnClose() {
        try {
            if (typeof this.onClose === 'function') {
                this.onClose()
            }
        } catch (error) {
            console.log(error)
        }
    }

}