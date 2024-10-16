(function () {
    if (!(cc && cc.EditBox)) {
        return;
    }
    
    const EditBox = cc.EditBox;
    const js = cc.js;
    const KeyboardReturnType = EditBox.KeyboardReturnType;
    const MAX_VALUE = 65535;

    function getKeyboardReturnType (type) {
        switch (type) {
            case KeyboardReturnType.DEFAULT:
            case KeyboardReturnType.DONE:
                return 'done';
            case KeyboardReturnType.SEND:
                return 'send';
            case KeyboardReturnType.SEARCH:
                return 'search';
            case KeyboardReturnType.GO:
                return 'go';
            case KeyboardReturnType.NEXT:
                return 'next';
        }
        return 'done';
    }

    const BaseClass = EditBox._ImplClass;
    function MiniGameEditBoxImpl () {
        BaseClass.call(this);
    }

    js.extend(MiniGameEditBoxImpl, BaseClass);
    EditBox._ImplClass = MiniGameEditBoxImpl;

    Object.assign(MiniGameEditBoxImpl.prototype, {
        init (delegate) {
            if (!delegate) {
                cc.error('EditBox init failed');
                return;
            }
            this._delegate = delegate;
        },

        beginEditing () {
            // In case multiply register events
            if (this._editing) {
                return;
            }
            let delegate = this._delegate;
            this._showPrompt();
            this._editing = true;
            delegate.editBoxEditingDidBegan();
        },

        endEditing () {
            cc.warn(`Can't support to end editing.`);
        },

        _showPrompt () {
            let self = this;
            let delegate = this._delegate;
            let multiline = (delegate.inputMode === EditBox.InputMode.ANY);
            let maxLength = (delegate.maxLength < 0 ? MAX_VALUE : delegate.maxLength);

            if (multiline) {
                cc.warn(`Multiline editing is not supported`);
            }
            
            my.prompt({
                title: '',
                message: delegate.placeholder,
                // placeholder: delegate.placeholder,
                okButtonText: getKeyboardReturnType(delegate.returnType),
                cancelButtonText: 'cancel',
                success: (result) => {
                    if (result.ok) {
                        let inputValue = result.inputValue;
                        inputValue = (maxLength <= inputValue.length) ? inputValue.substring(0, maxLength) : inputValue;
                        if (delegate._string !== inputValue) {
                            delegate.editBoxTextChanged(inputValue);
                        }
                        delegate.editBoxEditingReturn();
                    }
                    self._editing = false;
                    delegate.editBoxEditingDidEnded();
                },
            });
        },
    });
})();

