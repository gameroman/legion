// Navbar.tsx

import { h, Component } from 'preact';
import { Link, useRouter } from 'preact-router';
import './navbar.style.css';

import UserInfoBar from '../userInfoBar/UserInfoBar';

import legionLogo from '@assets/logo.png';
import playIcon from '@assets/play_btn_idle.png';
import teamIcon from '@assets/team_btn_idle.png';
import shopIcon from '@assets/shop_btn_idle.png';
import rankIcon from '@assets/rank_btn_idle.png';
import playActiveIcon from '@assets/play_btn_active.png';
import teamActiveIcon from '@assets/team_btn_active.png';
import shopActiveIcon from '@assets/shop_btn_active.png';
import rankActiveIcon from '@assets/rank_btn_active.png';

enum MenuItems {
    PLAY = 'PLAY',
    TEAM = 'TEAM',
    SHOP = 'SHOP',
    RANK = 'RANK'
}

enum Routes {
    HOME = '/',
    PLAY = '/play',
    TEAM = '/team',
    SHOP = '/shop',
    RANK = '/rank'
}

class Navbar extends Component {
    state = {
        hovered: ''
    }

    render() {
        const route = useRouter();

        return (
            <div className="menu">
                <div className="flexContainer">
                    <div className="logoContainer">
                        <Link href="/play" className="gameLogo">
                            <img src={legionLogo} />
                        </Link>
                    </div>
                    <div className="avatarContainer">
                        <div className="avatar"></div>
                        <div className="userInfo">
                            <span>AVATAR NAME</span>
                            <div className="userLevel"><span>Lv.13</span></div>
                        </div>
                    </div>
                </div>

                <div className="menuItems">
                    <Link href="/play" onMouseOver={() => this.setState({hovered: MenuItems.PLAY})} onMouseLeave={() => this.setState({hovered: ''})}>
                        <div className={`menuItemContainer ${route[0].url === Routes.PLAY || route[0].url === Routes.HOME ? 'activeFlag' : ''}`}>
                            <img className="menuItem" src={this.state.hovered === MenuItems.PLAY ? playActiveIcon : playIcon} />
                        </div>
                    </Link>
                    <Link href="/team" onMouseOver={() => this.setState({hovered: MenuItems.TEAM})} onMouseLeave={() => this.setState({hovered: ''})}>
                        <div className={`menuItemContainer ${route[0].url === Routes.TEAM ? 'activeFlag' : ''}`}>
                            <img className="menuItem" src={this.state.hovered === MenuItems.TEAM ? teamActiveIcon :teamIcon} />
                        </div>
                    </Link>
                    <Link href="/shop" onMouseOver={() => this.setState({hovered: MenuItems.SHOP})} onMouseLeave={() => this.setState({hovered: ''})}>
                        <div className={`menuItemContainer ${route[0].url === Routes.SHOP ? 'activeFlag' : ''}`}>
                            <img className="menuItem" src={this.state.hovered === MenuItems.SHOP ? shopActiveIcon :shopIcon} />
                        </div>
                    </Link>
                    <Link href="/rank" onMouseOver={() => this.setState({hovered: MenuItems.RANK})} onMouseLeave={() => this.setState({hovered: ''})}>
                        <div className={`menuItemContainer ${route[0].url === Routes.RANK ? 'activeFlag' : ''}`}>
                            <img className="menuItem" src={this.state.hovered === MenuItems.RANK ? rankActiveIcon :rankIcon} />
                        </div>
                    </Link>
                </div>

                <div className="flexContainer">
                    <UserInfoBar label="3.000.000" />
                    <UserInfoBar label="1.235" elo={5.302} />
                    <div className="expand_btn"></div>
                </div>
            </div>
        );
    }
}

export default Navbar;