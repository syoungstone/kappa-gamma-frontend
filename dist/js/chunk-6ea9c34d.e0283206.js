(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-6ea9c34d"],{"03cf":function(a,t,e){},1393:function(a,t,e){"use strict";var n=e("23e7"),i=e("857a"),r=e("af03");n({target:"String",proto:!0,forced:r("big")},{big:function(){return i(this,"big","","")}})},"4d63":function(a,t,e){var n=e("83ab"),i=e("da84"),r=e("94ca"),o=e("7156"),s=e("9bf2").f,l=e("241c").f,u=e("44e7"),d=e("ad6d"),b=e("9f7f"),c=e("6eeb"),m=e("d039"),p=e("69f3").set,h=e("2626"),f=e("b622"),g=f("match"),v=i.RegExp,_=v.prototype,S=/a/g,y=/a/g,w=new v(S)!==S,C=b.UNSUPPORTED_Y,k=n&&r("RegExp",!w||C||m((function(){return y[g]=!1,v(S)!=S||v(y)==y||"/a/i"!=v(S,"i")})));if(k){var M=function(a,t){var e,n=this instanceof M,i=u(a),r=void 0===t;if(!n&&i&&a.constructor===M&&r)return a;w?i&&!r&&(a=a.source):a instanceof M&&(r&&(t=d.call(a)),a=a.source),C&&(e=!!t&&t.indexOf("y")>-1,e&&(t=t.replace(/y/g,"")));var s=o(w?new v(a,t):v(a,t),n?this:_,M);return C&&e&&p(s,{sticky:e}),s},$=function(a){a in M||s(M,a,{configurable:!0,get:function(){return v[a]},set:function(t){v[a]=t}})},I=l(v),B=0;while(I.length>B)$(I[B++]);_.constructor=M,M.prototype=_,c(i,"RegExp",M)}h("RegExp")},7394:function(a,t,e){},"7394f":function(a,t,e){"use strict";e("7394")},"7db0":function(a,t,e){"use strict";var n=e("23e7"),i=e("b727").find,r=e("44d2"),o="find",s=!0;o in[]&&Array(1)[o]((function(){s=!1})),n({target:"Array",proto:!0,forced:s},{find:function(a){return i(this,a,arguments.length>1?arguments[1]:void 0)}}),r(o)},"857a":function(a,t,e){var n=e("1d80"),i=/"/g;a.exports=function(a,t,e,r){var o=String(n(a)),s="<"+t;return""!==e&&(s+=" "+e+'="'+String(r).replace(i,"&quot;")+'"'),s+">"+o+"</"+t+">"}},"9f51":function(a,t,e){"use strict";var n=function(){var a=this,t=a.$createElement,n=a._self._c||t;return n("div",{staticClass:"narrow-wrapper"},[a.created?n("div",{attrs:{id:"created"}},[n("h2",[a._v(a._s(a.response))]),n("b-button",{staticClass:"selection-button",on:{click:function(t){return a.reset()}}},[a._v("Create Another")])],1):a.newEntry&&a.loaded&&null==a.data.is_pledge?n("div",{attrs:{id:"buttons"}},[n("h2",[a._v("Would you like to create an entry for a pledge or a brother?")]),n("b-button",{staticClass:"selection-button",on:{click:function(t){a.data.is_pledge=1}}},[a._v("Create Pledge")]),n("b-button",{staticClass:"selection-button",on:{click:function(t){a.data.is_pledge=0}}},[a._v("Create Brother")])],1):a.loaded?n("b-form",{on:{submit:function(t){return t.preventDefault(),a.onSubmit(t)}}},[a.data.photo&&a.$store.state.isOfficer?n("div",{directives:[{name:"b-modal",rawName:"v-b-modal.photo-modal",modifiers:{"photo-modal":!0}}],staticClass:"thumbnail"},[n("img",{attrs:{src:a.data.photo,alt:"Profile photo"}}),n("div",{staticClass:"overlay"},[n("div",{staticClass:"overlay-text"},[a._v("Change Photo")])])]):a.isBrother&&a.$store.state.isOfficer?n("div",{directives:[{name:"b-modal",rawName:"v-b-modal.photo-modal",modifiers:{"photo-modal":!0}}],staticClass:"thumbnail"},[n("img",{attrs:{src:e("da33"),alt:"Photo placeholder"}}),n("div",{staticClass:"overlay"},[n("div",{staticClass:"overlay-text"},[a._v("Change Photo")])])]):a._e(),n("b-modal",{ref:"modal",attrs:{id:"photo-modal",title:"Change Photo"},on:{show:a.resetModal,hidden:a.resetModal,ok:a.handleOk}},[n("form",{ref:"form",on:{submit:function(t){return t.stopPropagation(),t.preventDefault(),a.handleSubmit(t)}}},[n("b-form-group",{attrs:{label:"Please enter photo URL","label-for":"url-input","invalid-feedback":"Invalid URL",state:a.photoState}},[n("b-form-input",{attrs:{id:"url-input",state:a.photoState,required:""},model:{value:a.photo,callback:function(t){a.photo=t},expression:"photo"}})],1)],1)]),n("b-modal",{ref:"modal",attrs:{id:"big-modal",title:"Assign Big"},on:{ok:a.changeBig}},[a.bigsLoaded?n("form",{ref:"form",on:{submit:function(t){return t.stopPropagation(),t.preventDefault(),a.handleSubmit(t)}}},[n("b-form-group",{attrs:{id:"input-group-x","label-for":"input-x"}},[n("vue-single-select",{attrs:{inputId:"input-x",options:a.bigs,"option-key":"id","option-label":"full_name",required:"",getOptionDescription:a.getCustomDescriptionBig},model:{value:a.newBig,callback:function(t){a.newBig=t},expression:"newBig"}})],1)],1):n("LoadingSpinner"),a.bigsError?n("div",{staticClass:"mt-3"},[n("strong",[a._v(a._s(a.bigsError))])]):a._e()],1),a.newEntry?a._e():n("h1",[a._v(" "+a._s(a.data.name_first+" ")+" "+a._s(a.data.name_middle?a.data.name_middle+" ":"")+" "+a._s(a.data.name_last)+" ")]),a.$store.state.isOfficer?n("h3",[a._v("Membership")]):a._e(),a.isBrother&&a.$store.state.isOfficer?n("b-form-group",{attrs:{id:"select-group-0",label:"Status:","label-for":"select-0"}},[n("b-form-select",{attrs:{id:"select-0",options:a.statusOptions,required:a.isBrother&&a.$store.state.isOfficer},model:{value:a.data.brother_status,callback:function(t){a.$set(a.data,"brother_status",t)},expression:"data.brother_status"}})],1):a._e(),a.isBrother&&a.$store.state.isOfficer?n("b-form-group",{attrs:{id:"select-group-1",label:"Standing:","label-for":"select-1"}},[n("b-form-select",{attrs:{id:"select-1",options:a.standingOptions,required:a.isBrother&&a.$store.state.isOfficer},model:{value:a.data.good_standing,callback:function(t){a.$set(a.data,"good_standing",t)},expression:"data.good_standing"}})],1):a._e(),a.isBrother&&a.$store.state.isOfficer?n("b-form-group",{attrs:{id:"input-group-0",label:"Roll Number:","label-for":"input-0"}},[n("b-form-input",{attrs:{id:"input-0",type:"number",required:a.isBrother&&a.$store.state.isOfficer},model:{value:a.data.roll_number,callback:function(t){a.$set(a.data,"roll_number",t)},expression:"data.roll_number"}})],1):a._e(),a.$store.state.isOfficer?n("b-form-group",{attrs:{id:"input-group-pledge-class",label:"Pledge Class:","label-for":"input-pledge-class"}},[n("vue-single-select",{attrs:{inputId:"input-pledge-class",options:a.pledgeClasses,required:a.$store.state.isOfficer},model:{value:a.data.pledge_class,callback:function(t){a.$set(a.data,"pledge_class",t)},expression:"data.pledge_class"}})],1):a._e(),a.$store.state.isOfficer?n("b-form-group",{attrs:{id:"input-group-d",label:"Nickname:","label-for":"input-d"}},[n("b-form-input",{attrs:{id:"input-d"},model:{value:a.data.nickname,callback:function(t){a.$set(a.data,"nickname",t)},expression:"data.nickname"}})],1):a._e(),a.$store.state.isOfficer?n("b-form-group",{attrs:{id:"input-group-big",label:"Big:","label-for":"input-big"}},[n("div",{staticClass:"input-group mb-3"},[n("input",{directives:[{name:"model",rawName:"v-model",value:a.data.big_name,expression:"data.big_name"}],staticClass:"form-control",attrs:{disabled:!0,type:"text",placeholder:"None selected"},domProps:{value:a.data.big_name},on:{input:function(t){t.target.composing||a.$set(a.data,"big_name",t.target.value)}}}),n("div",{staticClass:"input-group-append"},[n("button",{directives:[{name:"b-modal",rawName:"v-b-modal.big-modal",modifiers:{"big-modal":!0}}],staticClass:"btn btn-secondary",attrs:{type:"button"},on:{click:function(t){return a.loadBigs()}}},[a._v(" Change ")])])])]):a._e(),n("h3",[a._v("Personal")]),a.$store.state.isOfficer?n("b-form-group",{attrs:{id:"input-group-a",label:"First Name:","label-for":"input-a"}},[n("b-form-input",{attrs:{id:"input-a",required:a.$store.state.isOfficer},model:{value:a.data.name_first,callback:function(t){a.$set(a.data,"name_first",t)},expression:"data.name_first"}})],1):a._e(),a.$store.state.isOfficer?n("b-form-group",{attrs:{id:"input-group-b",label:"Middle Name:","label-for":"input-b"}},[n("b-form-input",{attrs:{id:"input-b"},model:{value:a.data.name_middle,callback:function(t){a.$set(a.data,"name_middle",t)},expression:"data.name_middle"}})],1):a._e(),a.$store.state.isOfficer?n("b-form-group",{attrs:{id:"input-group-c",label:"Last Name:","label-for":"input-c"}},[n("b-form-input",{attrs:{id:"input-c",required:a.$store.state.isOfficer},model:{value:a.data.name_last,callback:function(t){a.$set(a.data,"name_last",t)},expression:"data.name_last"}})],1):a._e(),n("b-form-group",{attrs:{id:"input-group-2",label:"Major:","label-for":"input-2"}},[n("b-form-input",{attrs:{id:"input-2",required:""},model:{value:a.data.major,callback:function(t){a.$set(a.data,"major",t)},expression:"data.major"}})],1),n("b-form-group",{attrs:{id:"input-group-3",label:"Graduation Year:","label-for":"input-3","invalid-feedback":"Not a valid graduation year.",state:a.state2}},[n("b-form-input",{attrs:{id:"input-3",type:"number",state:a.state2,required:""},on:{input:function(t){return a.updateState2()}},model:{value:a.data.grad_year,callback:function(t){a.$set(a.data,"grad_year",t)},expression:"data.grad_year"}})],1),n("b-form-group",{attrs:{id:"input-group-4",label:"Hometown:","label-for":"input-4"}},[n("b-form-input",{attrs:{id:"input-4",required:""},model:{value:a.data.hometown,callback:function(t){a.$set(a.data,"hometown",t)},expression:"data.hometown"}})],1),"United States of America"==a.data.home_country?n("b-form-group",{attrs:{id:"input-group-y",label:"Home State:","label-for":"input-y"}},[n("vue-single-select",{attrs:{inputId:"input-y",options:a.stateList,"option-key":"abbreviation","option-label":"name",required:"United States of America"==a.data.home_country,getOptionDescription:a.getCustomDescriptionState},model:{value:a.newState,callback:function(t){a.newState=t},expression:"newState"}})],1):a._e(),n("b-form-group",{attrs:{id:"input-group-x",label:"Home Country:","label-for":"input-x"}},[n("vue-single-select",{attrs:{inputId:"input-x",options:a.countryList,required:""},model:{value:a.data.home_country,callback:function(t){a.$set(a.data,"home_country",t)},expression:"data.home_country"}})],1),n("h3",[a._v("Contact")]),n("b-form-group",{attrs:{id:"input-group-e",label:"Email:"+(a.newEntry?"":" (changing this will change the email needed to log in)"),"label-for":"input-e"}},[n("b-form-input",{attrs:{id:"input-e",type:"email",required:""},model:{value:a.data.email,callback:function(t){a.$set(a.data,"email",t)},expression:"data.email"}})],1),n("b-form-group",{attrs:{id:"input-group-1",label:"Phone Number:","label-for":"input-1","invalid-feedback":"Phone number must be exactly 10 digits.",state:a.state1}},[n("b-form-input",{attrs:{id:"input-1",type:"tel",state:a.state1,required:""},on:{input:function(t){return a.updateState1()}},model:{value:a.data.phone_number,callback:function(t){a.$set(a.data,"phone_number",t)},expression:"data.phone_number"}})],1),n("b-button",{attrs:{type:"submit",variant:"primary",disabled:a.submitDisabled}},[a._v(a._s(a.newEntry?"Create "+(a.data.is_pledge?"Pledge":"Brother"):"Save Changes"))])],1):n("LoadingSpinner")],1)},i=[],r=(e("d81d"),e("7db0"),e("4d63"),e("ac1f"),e("25f0"),e("1393"),e("b0c0"),e("bc3a")),o=e.n(r),s=e("d76c"),l={name:"StudentForm",props:{id:String},components:{LoadingSpinner:s["a"]},computed:{submitDisabled:function(){return!((this.state1||null==this.state1)&&(this.state2||null==this.state2))},isBrother:function(){return 0==this.data.is_pledge}},created:function(){var a=this;this.newEntry=null==this.id,this.$store.state.isOfficer?o.a.get(this.$store.state.apiURL+"read_pledge_classes.php",{headers:{Authorization:this.$store.state.jwt}}).then((function(t){a.pledgeClasses=t.data.body.map((function(a){return a.class_name})),a.getInfo()})).catch((function(t){return a.$root.$children[0].showError(t)})):this.getInfo()},data:function(){return{defaultData:{is_pledge:null,name_first:null,nume_middle:null,name_last:null,grad_year:null,nickname:null,major:null,hometown:null,home_state:null,home_country:null,email:null,phone_number:null,big:null,big_name:null,pledge_class:null,roll_number:null,brother_status:null,good_standing:null,photo:null},data:null,countryList:["Afghanistan","Åland Islands","Albania","Algeria","American Samoa","Andorra","Angola","Anguilla","Antigua and Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bonaire, Sint Eustatius and Saba","Bosnia and Herzegovina","Botswana","Bouvet Island","Brazil","British Indian Ocean Territory","Brunei Darussalam","Bulgaria","Burkina Faso","Burundi","Cabo Verde","Cambodia","Cameroon","Canada","Cayman Islands","Central African Republic","Chad","Chile","China","Christmas Island","Cocos Islands","Colombia","Comoros","Democratic Republic of the Congo","Republic of the Congo","Cook Islands","Costa Rica","Croatia","Cuba","Curaçao","Cyprus","Czechia","Côte d'Ivoire","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Eritrea","Estonia","Eswatini","Ethiopia","Falkland Islands [Malvinas]","Faroe Islands","Fiji","Finland","France","French Guiana","French Polynesia","French Southern Territories","Gabon","Gambia","Georgia","Germany","Ghana","Gibraltar","Greece","Greenland","Grenada","Guadeloupe","Guam","Guatemala","Guernsey","Guinea","Guinea-Bissau","Guyana","Haiti","Heard Island and McDonald Islands","Holy See","Honduras","Hong Kong","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Isle of Man","Israel","Italy","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kiribati","North Korea","South Korea","Kuwait","Kyrgyzstan","Lao People's Democratic Republic","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macao","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Marshall Islands","Martinique","Mauritania","Mauritius","Mayotte","Mexico","Federated States of Micronesia","Moldova","Monaco","Mongolia","Montenegro","Montserrat","Morocco","Mozambique","Myanmar","Namibia","Nauru","Nepal","Netherlands","New Caledonia","New Zealand","Nicaragua","Niger","Nigeria","Niue","Norfolk Island","Northern Mariana Islands","Norway","Oman","Pakistan","Palau","Palestine, State of","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Pitcairn","Poland","Portugal","Puerto Rico","Qatar","Republic of North Macedonia","Romania","Russian Federation","Rwanda","Réunion","Saint Barthélemy","Saint Helena, Ascension and Tristan da Cunha","Saint Kitts and Nevis","Saint Lucia","Saint Martin","Saint Pierre and Miquelon","Saint Vincent and the Grenadines","Samoa","San Marino","Sao Tome and Principe","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Sint Maarten","Slovakia","Slovenia","Solomon Islands","Somalia","South Africa","South Georgia and the South Sandwich Islands","South Sudan","Spain","Sri Lanka","Sudan","Suriname","Svalbard and Jan Mayen","Sweden","Switzerland","Syrian Arab Republic","Taiwan","Tajikistan","Tanzania","Thailand","Timor-Leste","Togo","Tokelau","Tonga","Trinidad and Tobago","Tunisia","Turkey","Turkmenistan","Turks and Caicos Islands","Tuvalu","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States of America","Uruguay","Uzbekistan","Vanuatu","Venezuela","Vietnam","Virgin Islands (U.K.)","Virgin Islands (U.S.)","Wallis and Futuna","Western Sahara","Yemen","Zambia","Zimbabwe"],stateList:[{name:"Alabama",abbreviation:"AL"},{name:"Alaska",abbreviation:"AK"},{name:"American Samoa",abbreviation:"AS"},{name:"Arizona",abbreviation:"AZ"},{name:"Arkansas",abbreviation:"AR"},{name:"California",abbreviation:"CA"},{name:"Colorado",abbreviation:"CO"},{name:"Connecticut",abbreviation:"CT"},{name:"Delaware",abbreviation:"DE"},{name:"District of Columbia",abbreviation:"DC"},{name:"Federated States of Micronesia",abbreviation:"FM"},{name:"Florida",abbreviation:"FL"},{name:"Georgia",abbreviation:"GA"},{name:"Guam",abbreviation:"GU"},{name:"Hawaii",abbreviation:"HI"},{name:"Idaho",abbreviation:"ID"},{name:"Illinois",abbreviation:"IL"},{name:"Indiana",abbreviation:"IN"},{name:"Iowa",abbreviation:"IA"},{name:"Kansas",abbreviation:"KS"},{name:"Kentucky",abbreviation:"KY"},{name:"Louisiana",abbreviation:"LA"},{name:"Maine",abbreviation:"ME"},{name:"Marshall Islands",abbreviation:"MH"},{name:"Maryland",abbreviation:"MD"},{name:"Massachusetts",abbreviation:"MA"},{name:"Michigan",abbreviation:"MI"},{name:"Minnesota",abbreviation:"MN"},{name:"Mississippi",abbreviation:"MS"},{name:"Missouri",abbreviation:"MO"},{name:"Montana",abbreviation:"MT"},{name:"Nebraska",abbreviation:"NE"},{name:"Nevada",abbreviation:"NV"},{name:"New Hampshire",abbreviation:"NH"},{name:"New Jersey",abbreviation:"NJ"},{name:"New Mexico",abbreviation:"NM"},{name:"New York",abbreviation:"NY"},{name:"North Carolina",abbreviation:"NC"},{name:"North Dakota",abbreviation:"ND"},{name:"Northern Mariana Islands",abbreviation:"MP"},{name:"Ohio",abbreviation:"OH"},{name:"Oklahoma",abbreviation:"OK"},{name:"Oregon",abbreviation:"OR"},{name:"Palau",abbreviation:"PW"},{name:"Pennsylvania",abbreviation:"PA"},{name:"Puerto Rico",abbreviation:"PR"},{name:"Rhode Island",abbreviation:"RI"},{name:"South Carolina",abbreviation:"SC"},{name:"South Dakota",abbreviation:"SD"},{name:"Tennessee",abbreviation:"TN"},{name:"Texas",abbreviation:"TX"},{name:"Utah",abbreviation:"UT"},{name:"Vermont",abbreviation:"VT"},{name:"Virgin Islands",abbreviation:"VI"},{name:"Virginia",abbreviation:"VA"},{name:"Washington",abbreviation:"WA"},{name:"West Virginia",abbreviation:"WV"},{name:"Wisconsin",abbreviation:"WI"},{name:"Wyoming",abbreviation:"WY"}],bigs:[],newBig:null,newState:null,pledgeClasses:null,statusOptions:[{value:"active",text:"Active"},{value:"inactive",text:"Inactive"},{value:"early alum",text:"Early alum"},{value:"alumni",text:"Alumni"}],standingOptions:[{value:1,text:"In Good Standing"},{value:0,text:"Not In Good Standing"}],newEntry:!1,created:!1,photo:"",photoState:null,response:null,loaded:!1,bigsLoaded:!1,bigsError:null,state1:null,state2:null}},methods:{getInfo:function(){var a=this;this.newEntry?(this.data=JSON.parse(JSON.stringify(this.defaultData)),this.loaded=!0):o.a.get(this.$store.state.apiURL+"read_student.php?id="+this.id,{headers:{Authorization:this.$store.state.jwt}}).then((function(t){a.data=t.data,a.newState=null==a.data.home_state?null:a.stateList.find((function(t){return t.abbreviation==a.data.home_state})),a.photo=a.data.photo,a.loaded=!0})).catch((function(t){return a.$root.$children[0].showError(t)}))},onSubmit:function(){this.checkData()&&this.sendData()},checkData:function(){return 0==this.data.is_pledge&&this.data.roll_number<=0?(this.$root.$children[0].showError("Roll number must be greater than 0."),!1):!(0==this.data.is_pledge&&null!=this.data.big_roll_number&&parseInt(this.data.roll_number)<=parseInt(this.data.big_roll_number))||(this.$root.$children[0].showError("Changes cannot be saved. Big's roll number must be lower than student's roll number."),!1)},sendData:function(){var a=this;this.data.home_state=null==this.newState?null:this.newState.abbreviation;var t=this.newEntry?"create_student.php":"update_student.php?id="+this.data.id;o.a.post(this.$store.state.apiURL+t,this.data,{headers:{Authorization:this.$store.state.jwt}}).then((function(t){t.data.success?a.newEntry?(a.response=t.data.message,a.created=!0):a.$root.$children[0].showSuccess(t.data.message):a.$root.$children[0].showError(t.data.message)})).catch((function(t){a.$root.$children[0].showError(t)}))},checkUrlValidity:function(){var a=/^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;return this.photoState=a.test(this.photo)||""==this.photo,this.photoState},resetModal:function(){this.photoState=null},handleOk:function(a){a.preventDefault(),this.handleSubmit()},handleSubmit:function(){var a=this;this.checkUrlValidity()&&(this.data.photo=this.photo,this.$nextTick((function(){a.$bvModal.hide("photo-modal")})))},updateState1:function(){var a=new RegExp("[0-9]{10}");this.state1=a.test(this.data.phone_number)&&10==this.data.phone_number.length},updateState2:function(){this.state2=this.data.grad_year>=1998&&this.data.grad_year<2100},loadBigs:function(){var a=this;o.a.get(this.$store.state.apiURL+"read_brother_names.php",{headers:{Authorization:this.$store.state.jwt}}).then((function(t){a.bigs=t.data.body,a.newBig=null==a.data.big?null:a.bigs.find((function(t){return t.id==a.data.big})),a.bigsLoaded=!0})).catch((function(t){return a.bigsError=t}))},getCustomDescriptionBig:function(a){return a.roll_number+" "+a.full_name},getCustomDescriptionState:function(a){return a.name},changeBig:function(){this.bigsLoaded=!1,null!=this.newBig?null==this.data.roll_number||parseInt(this.data.roll_number)>=parseInt(this.newBig.roll_number)?(this.data.big=this.newBig.id,this.data.big_name=this.newBig.full_name,this.data.big_roll_number=this.newBig.roll_number):this.$root.$children[0].showError("Cannot change big to "+this.newBig.full_name+". Big's roll number must be lower than student's roll number."):(this.data.big=null,this.data.big_name=null)},reset:function(){this.data=JSON.parse(JSON.stringify(this.defaultData)),this.created=!1}}},u=l,d=(e("7394f"),e("2877")),b=Object(d["a"])(u,n,i,!1,null,"2c342e2c",null);t["a"]=b.exports},ac45:function(a,t,e){"use strict";e("03cf")},af03:function(a,t,e){var n=e("d039");a.exports=function(a){return n((function(){var t=""[a]('"');return t!==t.toLowerCase()||t.split('"').length>3}))}},d76c:function(a,t,e){"use strict";var n=function(){var a=this,t=a.$createElement,e=a._self._c||t;return e("div",{attrs:{id:"spinner-wrapper"}},[e("b-spinner",{staticStyle:{width:"3rem",height:"3rem"},attrs:{variant:"primary"}})],1)},i=[],r={name:"LoadingSpinner"},o=r,s=(e("ac45"),e("2877")),l=Object(s["a"])(o,n,i,!1,null,"046d5688",null);t["a"]=l.exports},d81d:function(a,t,e){"use strict";var n=e("23e7"),i=e("b727").map,r=e("1dde"),o=r("map");n({target:"Array",proto:!0,forced:!o},{map:function(a){return i(this,a,arguments.length>1?arguments[1]:void 0)}})},da33:function(a,t,e){a.exports=e.p+"img/nophoto.11f4fe67.jpg"}}]);
//# sourceMappingURL=chunk-6ea9c34d.e0283206.js.map