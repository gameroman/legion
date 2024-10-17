import { h, Component, createRef } from 'preact';

interface SettingsModalProps {
  onClose: () => void;
}

export class SettingsModal extends Component<SettingsModalProps> {
    musicControlLineRef = createRef();
    musicControlThumbRef = createRef();
    sfxControlLineRef = createRef();
    sfxControlThumbRef = createRef();
  
    state = {
      musicCurrentValue: 50,
      musicMinValue: 0,
      musicMaxValue: 100,
      sfxCurrentValue: 50,
      sfxMinValue: 0,
      sfxMaxValue: 100,
      settingMenuCur: 0,
    }
  
    componentDidMount() {
      this.updateMusicControlThumb();
      this.updateSFXControlThumb();
    }
  
    componentDidUpdate(prevProps, prevState) {
      if (prevState.musicCurrentValue !== this.state.musicCurrentValue) {
        this.updateMusicControlThumb();
      }
      if (prevState.sfxCurrentValue !== this.state.sfxCurrentValue) {
        this.updateSFXControlThumb();
      }
    }
  
    updateMusicControlThumb = () => {
      if (this.musicControlLineRef.current && this.musicControlThumbRef.current) {
        const musicControlLineRect = this.musicControlLineRef.current.getBoundingClientRect();
        const musicThumbPosition = ((this.state.musicCurrentValue - this.state.musicMinValue) / (this.state.musicMaxValue - this.state.musicMinValue)) * musicControlLineRect.width;
        this.musicControlThumbRef.current.style.left = `${musicThumbPosition}px`;
      }
    }
  
    handleMusicThumbDrag = (event) => {
      event.preventDefault();
  
      const musicControlLineRect = this.musicControlLineRef.current.getBoundingClientRect();
  
      const handleMusicMouseMove = (e) => {
        const newPosition = e.clientX - musicControlLineRect.left;
        const newValue = ((newPosition / musicControlLineRect.width) * (this.state.musicMaxValue - this.state.musicMinValue)) + this.state.musicMinValue;
        this.setState({ musicCurrentValue: Math.max(this.state.musicMinValue, Math.min(this.state.musicMaxValue, newValue)) });
      };
  
      const handleMusicMouseUp = () => {
        document.removeEventListener('mousemove', handleMusicMouseMove);
        document.removeEventListener('mouseup', handleMusicMouseUp);
      };
  
      document.addEventListener('mousemove', handleMusicMouseMove);
      document.addEventListener('mouseup', handleMusicMouseUp);
    };
  
    updateSFXControlThumb = () => {
      if (this.sfxControlLineRef.current && this.sfxControlThumbRef.current) {
        const sfxControlLineRect = this.sfxControlLineRef.current.getBoundingClientRect();
        const sfxThumbPosition = ((this.state.sfxCurrentValue - this.state.sfxMinValue) / (this.state.sfxMaxValue - this.state.sfxMinValue)) * sfxControlLineRect.width;
        this.sfxControlThumbRef.current.style.left = `${sfxThumbPosition}px`;
      }
    }
  
    handleSFXThumbDrag = (event) => {
      event.preventDefault();
  
      const sfxControlLineRect = this.sfxControlLineRef.current.getBoundingClientRect();
  
      const handleSFXMouseMove = (e) => {
        const newPosition = e.clientX - sfxControlLineRect.left;
        const newValue = ((newPosition / sfxControlLineRect.width) * (this.state.sfxMaxValue - this.state.sfxMinValue)) + this.state.sfxMinValue;
        this.setState({ sfxCurrentValue: Math.max(this.state.sfxMinValue, Math.min(this.state.sfxMaxValue, newValue)) });
      };
  
      const handleSFXMouseUp = () => {
        document.removeEventListener('mousemove', handleSFXMouseMove);
        document.removeEventListener('mouseup', handleSFXMouseUp);
      };
  
      document.addEventListener('mousemove', handleSFXMouseMove);
      document.addEventListener('mouseup', handleSFXMouseUp);
    };
  
    render() {
      return (
        <div className="setting_menu flex flex_col gap_4">
          <div className="setting_dialog">
            <div className="setting_dialog_keyboard">
              Keyboard layout:
            </div>
            <div className="setting_dialog_keyboard_btn_container flex justify_center gap_4">
              <div className={this.state.settingMenuCur === 0 ? "setting_menu_btn setting_menu_btn_active" : "setting_menu_btn setting_menu_btn_inactive"} onClick={() => this.setState({ settingMenuCur: 0 })}>Azerty</div>
              <div className={this.state.settingMenuCur === 1 ? "setting_menu_btn setting_menu_btn_active" : "setting_menu_btn setting_menu_btn_inactive"} onClick={() => this.setState({ settingMenuCur: 1 })}>Qwerty</div>
            </div>
            <div className="setting_dialog_control_bar_container">
              <div className="setting_dialog_control_name">Music volume: </div>
              <div className="setting_dialog_contol_lable_start">{this.state.musicMinValue}</div>
              <div className="setting_dialog_control_bar">
                <div className="setting_dialog_control_line" ref={this.musicControlLineRef}>
                  <div className="setting_dialog_control_thumb" ref={this.musicControlThumbRef} onMouseDown={this.handleMusicThumbDrag}></div>
                </div>
              </div>
              <div className="setting_dialog_control_label_end">{this.state.musicMaxValue}</div>
            </div>
            <div className="setting_dialog_control_bar_container">
              <div className="setting_dialog_control_name">SFX volume: </div>
              <div className="setting_dialog_contol_lable_start">{this.state.sfxMinValue}</div>
              <div className="setting_dialog_control_bar">
                <div className="setting_dialog_control_line" ref={this.sfxControlLineRef}>
                  <div className="setting_dialog_control_thumb" ref={this.sfxControlThumbRef} onMouseDown={this.handleSFXThumbDrag}></div>
                </div>
              </div>
              <div className="setting_dialog_contol_lable_end">{this.state.sfxMaxValue}</div>
            </div>
          </div>
          <div className="justify_center flex gap_4">
            <div className="setting_menu_btn" onClick={this.props.onClose}>Exit</div>
          </div>
        </div>
      );
    }
  }
