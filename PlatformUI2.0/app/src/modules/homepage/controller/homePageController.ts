/*******************************************************************************
 * Copyright 2017 Cognizant Technology Solutions
 * 
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License.  You may obtain a copy
 * of the License at
 * 
 *   http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.  See the
 * License for the specific language governing permissions and limitations under
 * the License.
 ******************************************************************************/

/// <reference path="../../../_all.ts" />

module ISightApp {
    export class HomePageController {
        static $inject = ['$location', '$window', '$cookies', '$rootScope', 'authenticationService', 'restEndpointService', '$sce', '$timeout', '$mdDialog', 'aboutService'];
        constructor(private $location, private $window, private $cookies, private $rootScope, private authenticationService: IAuthenticationService, private restEndpointService: IRestEndpointService, private $sce, private $timeout, private $mdDialog, private aboutService: IAboutService) {
            var self = this;
            this.authenticationService.validateSession();
            this.isValidUser = true;
            self.iframeStyle = 'width:100%; height:1600px;';
            var receiveMessage = function (evt) {
                var height = parseInt(evt.data);
                if (!isNaN(height)) {
                    self.iframeStyle = 'width:100%; height:' + (evt.data + 20) + 'px';
                    $timeout(0);
                }
            }
            window.addEventListener('message', receiveMessage, false);

            self.authenticationService.getGrafanaCurrentOrgAndRole()
                .then(function (data) {
                    if (data.grafanaCurrentOrgRole === 'Admin') {
                        self.showAdminTab = true;
                    } else {
                        self.showAdminTab = false;
                    }
                });
        }
        isValidUser: boolean = false;
        /*start for common code */
        isTabSeleted: boolean = false;
        imageurl1: string = "dist/icons/svg/landingPage/Admin_icon_selected.svg";
        imageurl2: string = "dist/icons/svg/landingPage/Dashboard_icon_normal.svg";
        imageurl3: string = "dist/icons/svg/landingPage/Healthcheck_icon_normal.svg";
        imageurl4: string = "dist/icons/svg/landingPage/Help_icon_normal.svg";
        imageurl5: string = "dist/icons/svg/landingPage/playlist_normal.svg";
        imageurl6: string = "dist/icons/svg/landingPage/logout_normal.svg";
        aboutImg: string = "dist/icons/svg/landingPage/about_normal.svg";
        grafanaHost: String = this.restEndpointService.getGrafanaHost();
        playListUrl: String = '';
        templateName: string = 'toolsConfiguration';
        shouldReload: boolean;
        selectedToolName: string;
        selectedToolCategory: string;
        footerMinHeight: string = 'min-height:' + (window.innerHeight - 146) + 'px;';
        footerHeight: string = '';
        mainContentMinHeight: string = 'min-height:' + (window.innerHeight - 146 - 96) + 'px';
        mainContentMinHeightWoSbTab: string = 'min-height:' + (window.innerHeight - 146 - 48) + 'px';
        iframeStyle = 'width:100%; height:1600px;border:0';
        iframeWidth = window.innerWidth - 20;
        iframeHeight = window.innerHeight;
        aboutMeContent = {};
        showAdminTab: boolean = false;
        showThrobber: boolean;

        public redirect(iconId: string): void {
            if (iconId == 'dashboard') {
                this.$location.path('/InSights/dashboard');
            } else if (iconId == 'settings') {
                this.$location.path('/InSights/toolsConfig');
            } else if (iconId == 'graphview') {
                this.$location.path('/InSights/explore');
            } else if (iconId == 'userview') {
                this.$location.path('/InSights/roles');
            } else if (iconId == 'prjtmapping') {
                this.$location.path('/InSights/onboardProject');
            } else if (iconId == 'healthcheck') {
                this.$location.path('/InSights/agent');
            }
        }

        public showAboutInsights() {
            let self = this;
            this.aboutService.loadDetails().then(function (data) {
                console.log(data);
                self.aboutMeContent['data'] = data
                self.$mdDialog.show({
                    controller: AboutDialogeController,
                    controllerAs: 'aboutDialogeController',
                    templateUrl: './dist/modules/homepage/view/aboutInsights.tmpl.html',
                    parent: angular.element(document.body),
                    preserveScope: true,
                    clickOutsideToClose: true,
                    bindToController: true,
                    locals: {
                        data: data
                    }
                })
            });
        }

        public closeDialog() {
            this.$mdDialog.cancel();
            this.$mdDialog.hide();
        }

        selectAct(tabName: string): void {
            this.authenticationService.validateSession();
            this.templateName = tabName;

            if ('playlist' === tabName) {
                this.playListUrl = this.$sce.trustAsResourceUrl(this.grafanaHost + '/dashboard/script/iSight.js?url=' + this.grafanaHost + '/playlists');
            } else {
                this.playListUrl = '';
            }
        }

        addSelectedImage(selectedTab: string): void {
            var self = this;
            if (selectedTab == 'Admin') {
                self.imageurl1 = "dist/icons/svg/landingPage/Admin_icon_selected.svg";
            }
            else if (selectedTab == 'Dashboards') {
                self.imageurl2 = "dist/icons/svg/landingPage/Dashboard_icon_selected.svg";
            }
            else if (selectedTab == 'HealthCheck') {
                self.imageurl3 = "dist/icons/svg/landingPage/Healthcheck_icon_selected.svg";
            }
            else if (selectedTab == 'Help') {
                self.imageurl4 = "dist/icons/svg/landingPage/Help_icon_selected.svg";
            }
            else if (selectedTab == 'Playlists') {
                self.imageurl5 = "dist/icons/svg/landingPage/playlist_selected.svg";
            }
        }

        removeSelectedImage(selectedTab: string): void {
            var self = this;
            if (selectedTab == 'Admin') {
                self.imageurl1 = "dist/icons/svg/landingPage/Admin_icon_normal.svg";
            }
            else if (selectedTab == 'Dashboards') {

                self.imageurl2 = "dist/icons/svg/landingPage/Dashboard_icon_normal.svg";
            }
            else if (selectedTab == 'HealthCheck') {
                self.imageurl3 = "dist/icons/svg/landingPage/Healthcheck_icon_normal.svg";

            }
            else if (selectedTab == 'Help') {
                self.imageurl4 = "dist/icons/svg/landingPage/Help_icon_normal.svg";
            }
            else if (selectedTab == 'Playlists') {
                self.imageurl5 = "dist/icons/svg/landingPage/playlist_normal.svg";
            }
        }

        addHoverImage(hoverTab: string): void {
            if (hoverTab === "about") {
                this.aboutImg = "dist/icons/svg/landingPage/about_selected.svg";
            }
            else if (hoverTab === 'Help') {
                this.imageurl4 = "dist/icons/svg/landingPage/Help_icon_selected.svg";
            }
            else if (hoverTab === 'Logout') {
                this.imageurl6 = "dist/icons/svg/landingPage/logout_selected.svg";
            }
        }

        removeHoverImage(hoverTab: string): void {
            var hover = this;
            if (hoverTab === 'about') {
                this.aboutImg = "dist/icons/svg/landingPage/about_normal.svg";
            }
            else if (hoverTab === 'Help') {
                this.imageurl4 = "dist/icons/svg/landingPage/Help_icon_normal.svg";
            } else if (hoverTab === 'Logout') {
                this.imageurl6 = "dist/icons/svg/landingPage/logout_normal.svg";
            }
        }

        logout(): void {
            //this.$cookies.remove('Authorization');
            //this.$cookies.remove('grafanaOrg');
            this.authenticationService.logout()
                .then(function (data) {
                    //console.log(data);
                });
            var cookieVal = this.$cookies.getAll();
            for (var key in cookieVal) {
                cookieVal[key] = '';
                this.$cookies.put(key, cookieVal[key]);
                this.$cookies.remove(key);
            }
            this.$location.path('/iSight/login');
        }
    }
}