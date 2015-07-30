!function(){"use strict";var e="undefined"!=typeof window?window:global;if("function"!=typeof e.require){var t={},o={},n=function(e,t){return{}.hasOwnProperty.call(e,t)},r=function(e,t){var o,n,r=[];o=/^\.\.?(\/|$)/.test(t)?[e,t].join("/").split("/"):t.split("/");for(var s=0,u=o.length;u>s;s++)n=o[s],".."===n?r.pop():"."!==n&&""!==n&&r.push(n);return r.join("/")},s=function(e){return e.split("/").slice(0,-1).join("/")},u=function(t){return function(o){var n=s(t),u=r(n,o);return e.require(u,t)}},a=function(e,t){var n={id:e,exports:{}};return o[e]=n,t(n.exports,u(e),n),n.exports},i=function(e,s){var u=r(e,".");if(null==s&&(s="/"),n(o,u))return o[u].exports;if(n(t,u))return a(u,t[u]);var i=r(u,"./index");if(n(o,i))return o[i].exports;if(n(t,i))return a(i,t[i]);throw new Error('Cannot find module "'+e+'" from "'+s+'"')},l=function(e,o){if("object"==typeof e)for(var r in e)n(e,r)&&(t[r]=e[r]);else t[e]=o},c=function(){var e=[];for(var o in t)n(t,o)&&e.push(o);return e};e.require=i,e.require.define=l,e.require.register=l,e.require.list=c,e.require.brunch=!0}}(),require.register("src/analytics",function(e,t,o){var n,r,s;Parse.initialize("iul0cVOM5mJWAj1HHBa158cpMoyEQ2wWxSK3Go9O","pbFnYPVaSunEmgjI8qTKqkW8nHKoB6Xor1DtOWpD"),s=t("./bundles"),n=s.bundleNames,r=s.getNextQuoteIndex,o.exports=function(e,t,o,s){var u,a;return null==t&&(t={}),null==o&&(o={}),null==s&&(s={}),s.platform="kongregate",o.lastSolvedBundleIndex&&(u=r(o.lastSolvedBundleIndex,o.lastSolvedQuoteIndex),a=""+n[u.bundleIndex]+"-"+(u.quoteIndex+1),s.round=a),Parse.Analytics.track(e,s)}}),require.register("src/bundles",function(e,t,o){var n,r,s,u,a,i;a=[t("./bundles/starter"),t("./bundles/quotes2"),t("./bundles/jokes")],r=["Starter","Quotes #2","Jokes"],i=function(e,t,o){var n;return e?t===e.length-1?o>R.last(e)?R.append(o,R.slice(0,-1,e)):e:t>e.length-1?R.append(o,e):e:(n=R.times(R.always(0),t),R.append(o,n))},s=function(e,t){return null==t?{quoteIndex:0,bundleIndex:0}:t===a[e].length-1?{quoteIndex:0,bundleIndex:a[e+1]?e+1:0}:{quoteIndex:t+1,bundleIndex:e}},u=function(e,t){var o;return o=s(e,t),0===o.quoteIndex&&0===o.bundleIndex},n=function(e,t){var o;return o=s(e,t),0===o.quoteIndex},o.exports={quoteBundles:a,bundleNames:r,updateProgressPerBundle:i,getNextQuoteIndex:s,noMoreQuotes:u,bundleCompleted:n}}),require.register("src/bundles/jokes",function(e,t,o){o.exports=[{quote:"What happens when you run behind a car?",source:"You get exhausted."},{quote:"What happens when you run in front of a car?",source:"You get tired."},{quote:"What happens to frogs that park illegally?",source:"They get toad."},{quote:"How do crazy people get through the forest?",source:"They take the psychopath."},{quote:"What do you call a fish without any eyes?",source:"A fsh."},{quote:"What do you call a fly without any wings?",source:"A walk."},{quote:"What do you call a cow without any legs?",source:"Ground beef."},{quote:"What do you call a cow with only two legs?",source:"Lean beef."},{quote:"What do you call a cow that just gave birth?",source:"De-calf-inated"},{quote:"How do you count cows?",source:"With a cowculator."}]}),require.register("src/bundles/quotes2",function(e,t,o){o.exports=[{quote:"If a tree falls in a forest and no one is around to hear it, does it make a sound?",source:"Philosophical thought experiment"},{quote:"You miss 100% of the shots you don’t take.",source:'Wayne Gretzky, the "greatest hockey player ever"'},{quote:"Life is what happens to you while you’re busy making other plans.",source:'"Beautiful Boy" lyrics by John Lennon'},{quote:"If all you have is a hammer, everything looks like a nail.",source:"Abraham Maslow"},{quote:"Be the change you wish to see in the world.",source:"Attributed to Mahatma Gandhi"},{quote:"Obstacles are what you see when you take your eyes off your goal.",source:"Henry Ford"},{quote:"Never try to teach a pig to sing; it wastes your time and it annoys the pig.",source:"Robert Heinlein (1907 - 1988) American Science Fiction Author"},{quote:"Two things are infinite: the universe and human stupidity; and I'm not sure about the universe.",source:"Albert Einstein"},{quote:"Did you know: Two thirds of the people on earth have never seen snow?",source:"Now you know"},{quote:'My Mama always said, "Life was like a box of chocolates; you never know what you\'re gonna get."',source:'Forrest Gump (Tom Hanks) in "Forrest Gump"'}]}),require.register("src/bundles/starter",function(e,t,o){o.exports=[{quote:"Happiness isn't having what you want, it's wanting what you have.",source:"Very old proverb"},{quote:"He who laughs last, laughs longest.",source:"Common idiom originating from an old English play"},{quote:"That's one small step for man, one giant leap for mankind.",source:"Neil Armstrong upon first ever lunar landing"},{quote:"Do... or do not. There is no try. Only do.",source:'Yoda in "Star Wars: Episode V - The Empire Strikes Back"'},{quote:"Talk sense to a fool and he calls you foolish.",source:"Euripides, Greek tragic dramatist (484 BC - 406 BC)"},{quote:"80% of success is just showing up.",source:"Woody Allen"},{quote:"If you choose not to decide, you still have made a choice.",source:'"Freewill" lyrics by Rush'},{quote:"Today is the tomorrow you worried about yesterday.",source:"Dale Carnegie, self-improvement author"},{quote:"You're almost to the end of the starter bundle!  Good job, keep going.",source:"Surprise!  Hi from the game's author.  How meta."},{quote:"Do not underestimate the power of the Force.",source:"Slight misquote of Darth Vader from Star Wars"}]}),require.register("src/game",function(e,t,o){var n,r,s,u,a,i,l,c,d,p,h;u=parent.kongregate,h=t("./bundles"),l=h.quoteBundles,r=h.bundleNames,s=h.getNextQuoteIndex,p=h.updateProgressPerBundle,a=h.noMoreQuotes,n=h.bundleCompleted,i=t("./persist"),c=t("./stats"),d=t("./analytics"),o.exports=function(){var e,t,o,h,g,f,m,v,y,b,w,x,k,I,S,D,E,q,H,P,M,Z,C,B,L,T,N,Q,O,A,F,G,K,U,W,V,j,Y,J,X,z,_,$,ee,te,oe,ne,re,se,ue,ae,ie,le,ce,de,pe,he,ge,fe,me,ve,ye;return e={startingHints:3,hintSetback:40,pointsForFreeHint:200,pointsPerLetter:5},t={},o={backgroundMusic:1,keyPressHit:.9},te=function(e){return t[e].play()},k=function(){return t.backgroundMusic},E=function(){return R.omit(["backgroundMusic"],t)},$=function(){return k().play()},z=function(){return k().pause()},ee=function(){return R.forEach(function(e){return e[1].volume(o[e[0]]||1)},R.toPairs(E()))},_=function(){return R.forEach(function(e){return e.volume(0)},R.values(E()))},v=function(){return k().fadeIn(o.backgroundMusic,2e3)},m={HIDDEN:0,REVEALED:1,SOLVED:2,HINTED:3,HINTEDFILLED:4},Z=function(e){return/[a-z]/i.test(e)},C=function(e){return/[a-z\s]/i.test(e)},L=function(e){return/[\s]/i.test(e)},se=R.mapIndexed(function(e,t){return{index:t,status:e}}),S=function(e){var t,o,n;return n=Math.floor(Math.random()*e.length),o=e[n],t=R.remove(n,1,e),[o,t]},D=function(e,t){var o;return null==t&&(t=1),"number"!=typeof t&&(console.error("expected a number, got",t),t=1),(o=function(e,n){var r,s,u;return u=S(e),s=u[0],r=u[1],n.push(s),n.length===t?n:o(r,n)})(e,[])},x=function(t){return Math.floor(t/e.pointsForFreeHint)*e.pointsForFreeHint},I=R.compose(R.add(e.pointsForFreeHint),x),O=function(t,o){var n,r;return r=t-o,n=I(r),Math.ceil(Math.max(0,o-(n-r))/e.pointsForFreeHint)},P=function(e){return Z(e)?m.HIDDEN:m.SOLVED},M=R.eq(m.HIDDEN),B=R.eq(m.SOLVED),f=R.zipWith(function(e,t){return{"char":e,status:t}}),ae=function(e){var t;return t=function(e,t,o){var n;return C(t)&&(L(t)?e.push([]):(n={"char":t,index:o},e[e.length-1].push(n))),e},R.reduceIndexed(t,[[]],e)},g=R.compose(R.join(""),R.map(R.prop("char"))),T=R.curry(function(e,t){var o;return o=function(t,o){return e[o.index]===m.SOLVED&&t++,t},R.reduce(o,0,t)!==t.length}),ie=function(e,t,o){return"function"==typeof e&&(e=e(t[o])),t[o]=e,t},le=R.curry(function(e,t,o){return R.reduce(R.partial(ie,e),t,o)}),de=le(m.SOLVED),ce=le(function(e){var t;return t={},t[m.HIDDEN]=m.REVEALED,t[m.HINTED]=m.HINTEDFILLED,t[e]||e}),re=function(e){var t,o;return t={},t[m.SOLVED]=m.SOLVED,t[m.HINTED]=m.HINTED,t[m.HINTEDFILLED]=m.HINTED,o=function(e){return t[e]||m.HIDDEN},R.map(o,e)},me=function(e,t,o){var n,r,s;return s=new RegExp("^"+e,"i"),n=g(o),s.test(n)?(r=R.map(R.prop("index"))(R.take(e.length,o)),e.length===o.length?de(t,r):ce(t,r)):t},w=function(e,t,o){return t.length<1?o:(o=R.reduce(R.partial(me,t),o,e),w(e,t.slice(1),o))},H=function(e,t){var o,n,r;return e.length<1?[]:(r=new RegExp("^"+e,"i"),n=R.compose(R.match(r),g),o=R.any(n,t),o?e:H(e.slice(1),t))},fe={start:{onEnter:function(){return pe("start")},onEvent:function(e,t,o,n){return"gameReady"===o?["loadingUser",t,n]:["start",t,n]},getRenderData:function(){return{secretMessage:[],feedback:"LOADING...",score:"",showPlayActions:!1}}},loadingUser:{onEnter:function(e,t){return pe("loadingUser"),q(t)},onEvent:function(e,t,o,n){return"userLoaded"===o?["loading",t,e]:["loadingUser",t,n]},getRenderData:function(){return{secretMessage:[],feedback:"LOADING...",score:"",showPlayActions:!1}}},loading:{onEnter:function(e,t){return pe("loading"),y(t)},onEvent:function(t,o,n,r){var s,u,a,i;return"quoteLoaded"===n?(u=function(e,t){var o;return o=function(e){return t[e]=m.HINTED},R.forEach(o,e)},a=t.message,i=t.source,s=R.map(P,a),r.progressPerBundle?0===r.progressPerBundle[0]?u([3,4],s):1===r.progressPerBundle[0]&&u([17],s):u([10,28,38,60],s),o.secretMessage=a,o.source=i,o.currentBundleIndex=t.bundleIndex,o.currentQuoteIndex=t.quoteIndex,o.comboGroups=ae(a),o.decodeKey=s,o.comboString="",o.score=R.filter(Z,a).length*e.pointsPerLetter,o.moves=0,o.hints=0,o.lastCombo=null,["play",o,r]):["loading",o,r]},getRenderData:function(){return{secretMessage:[],feedback:"LOADING...",score:"",showPlayActions:!1}}},play:{onEnter:function(){return pe("play")},onEvent:function(t,o,n,r){var s,u,a,i,l,h,g,f,v,y,b,x,k,I,S,E;if("giveUp"===n)return["gaveUp",o,r];if("hint"===n){if(r.hintsRemaining<=0)return d("outOfHints"),["outOfHints",o,r];if(d("useHint",o,r),b=function(e){return Math.ceil(e/10)},h=se(o.decodeKey),i=R.filter(R.compose(M,R.prop("status")))(h),0===i.length)return["play",o,r];l=b(i.length),u=D(i,l),g=R.map(R.prop("index"),u),v=o.score-e.hintSetback<0?0:o.score-e.hintSetback,o.decodeKey=le(m.HINTED,o.decodeKey,g),o.hints+=1,o.score=v,r.hintsRemaining-=1,ue(r),x=function(e,t){return null==t&&(t=1),te("keyPressMiss"),e>t?setTimeout(function(){return x(e,t+1)},120):void 0},x(l)}return"keyPress"===n&&(s=String.fromCharCode(t.keyCode).toLowerCase(),Z(s)&&(k=o.comboString+s,a=re(o.decodeKey),S=R.filter(T(o.decodeKey),o.comboGroups),o.moves+=1,o.score=Math.max(0,o.score-1),o.comboString=H(k,S),o.decodeKey=w(o.comboGroups,o.comboString,a),o.lastCombo=o.comboCompleted===!0?s:k,y=R.filter(T(o.decodeKey),o.comboGroups),o.comboCompleted=S.length>y.length,f=!!o.comboString.length,E=o.comboCompleted===!0,te(E?"keyPressHit":f?"keyPressHit":"keyPressMiss")),I=R.length(R.filter(B)(o.decodeKey)),I===o.secretMessage.length)?(te("solved"),r.totalScore+=o.score,r.hintsRemaining+=O(r.totalScore,o.score),r.lastSolvedBundleIndex=o.currentBundleIndex,r.lastSolvedQuoteIndex=o.currentQuoteIndex,r.progressPerBundle=p(r.progressPerBundle,o.currentBundleIndex,o.currentQuoteIndex),c(r),ue(r),["solved",o,r]):["play",o,r]},getRenderData:function(e){var t,o,n,r,s,u;return s=function(t,o){return Z(e.secretMessage[o])},u=R.filterIndexed(s,e.decodeKey),o=function(e){return e===m.REVEALED||e===m.SOLVED||e===m.HINTEDFILLED},n=R.length(R.filter(o,u)),r=n/u.length,t=e.comboString.length?e.comboString:null,{secretMessage:f(e.secretMessage,e.decodeKey),feedback:t||e.lastCombo||"Type letters to begin revealing the hidden message.",match:e.lastCombo?!!e.comboString.length>0:null,score:e.score,showPlayActions:!0,progress:r}}},gaveUp:{onEnter:function(){return pe("gaveUp")},onEvent:function(t,o,n,r){var s;return"confirm"===n?(d("giveUp",o,r),te("giveUp"),s=R.length(R.filter(R.compose(R.not,B))(o.decodeKey)),r.lastSolvedBundleIndex=o.currentBundleIndex,r.lastSolvedQuoteIndex=o.currentQuoteIndex,r.totalScore-=s*e.pointsPerLetter,r.progressPerBundle=p(r.progressPerBundle,o.currentBundleIndex,o.currentQuoteIndex),c(r),ue(r),["confirmedGiveUp",o,r]):"cancel"===n?["play",o,r]:["gaveUp",o,r]},getRenderData:function(t){var o,n;return n=e.pointsPerLetter*R.length(R.filter(R.compose(R.not,B))(t.decodeKey)),o=t.comboString.length?t.comboString:null,{secretMessage:f(t.secretMessage,t.decodeKey),feedback:o||t.lastCombo||"Type letter combos to reveal the hidden message.",match:t.lastCombo?!!t.comboString.length>0:null,score:t.score,showPlayActions:!0,buyHints:!0,giveUp:!0,giveUpCost:n}}},confirmedGiveUp:{onEnter:function(){return pe("confirmedGiveUp")},onEvent:function(e,t,o,r){return"keyPress"===o&&32===e.keyCode?(t.secretMessage=void 0,t.source=void 0,t.comboGroups=void 0,t.decodeKey=void 0,t.comboString=void 0,t.score=void 0,t.moves=void 0,t.hints=void 0,t.lastCombo=void 0,a(r.lastSolvedBundleIndex,r.lastSolvedQuoteIndex)?["noMoreQuotes",t,r]:n(r.lastSolvedBundleIndex,r.lastSolvedQuoteIndex)?["bundleCompleted",t,r]:["loading",t,r]):["confirmedGiveUp",t,r]},getRenderData:function(e){return{secretMessage:f(e.secretMessage,R.map(R.always(m.SOLVED),e.decodeKey)),source:e.source,gaveUp:!0,feedback:"You gave up!<br>Press 'Space bar' to play again.",score:0,showPlayActions:!1,showLogInLink:null!=u?u.services.isGuest():void 0}}},solved:{onEnter:function(){return pe("solved")},onEvent:function(e,t,o,r){return"keyPress"===o&&32===e.keyCode?(t.secretMessage=void 0,t.source=void 0,t.comboGroups=void 0,t.decodeKey=void 0,t.comboString=void 0,t.score=void 0,t.moves=void 0,t.hints=void 0,t.lastCombo=void 0,a(r.lastSolvedBundleIndex,r.lastSolvedQuoteIndex)?["noMoreQuotes",t,r]:n(r.lastSolvedBundleIndex,r.lastSolvedQuoteIndex)?["bundleCompleted",t,r]:["loading",t,r]):["solved",t,r]},getRenderData:function(e){var t;return t=e.hints>1?e.hints:"no",{secretMessage:f(e.secretMessage,e.decodeKey),source:e.source,feedback:"SOLVED in "+e.moves+" moves!<br>Press 'Space bar' to play again.",score:e.score,showPlayActions:!1,solved:!0,showLogInLink:null!=u?u.services.isGuest():void 0}}},outOfHints:{onEnter:function(){return pe("outOfHints")},onEvent:function(e,t,o,n){return"confirm"===o?["play",t,n]:["outOfHints",t,n]},getRenderData:function(e){var t;return t=e.comboString.length?e.comboString:null,{secretMessage:f(e.secretMessage,e.decodeKey),feedback:t||e.lastCombo||"Type letter combos to reveal the hidden message.",match:e.lastCombo?!!e.comboString.length>0:null,score:e.score,showPlayActions:!0,buyHints:!0}}},noMoreQuotes:{onEnter:function(){return pe("noMoreQuotes")},onEvent:function(e,t,o,n){return"confirm"===o?["loading",t,n]:["noMoreQuotes",t,n]},getRenderData:function(){return{secretMessage:"",feedback:"",showPlayActions:!1,noMoreQuotes:!0}}},bundleCompleted:{onEnter:function(){return pe("bundleCompleted")},onEvent:function(e,t,o,n){return"confirm"===o?["loading",t,n]:["bundleCompleted",t,n]},getRenderData:function(){return{secretMessage:"",feedback:"",showPlayActions:!1,bundleCompleted:!0}}}},b=function(e,t,o){var n,r,s,u;return u=e.state.onEvent(o,e.scope,t,e.userData),r=u[0],n=u[1],s=u[2],fe[r]!==e.state&&fe[r].onEnter(n,s),ne(fe[r].getRenderData(n),n,s),{state:fe[r],scope:n,userData:s}},ve=function(e,t){var o,n,r,s,u;return s=K(this.store,this.currentState,e,t,this.userData),this.store=s[0],this.currentState=s[1],this.userData=s[2],u=b({state:this.currentState,scope:this.store,userData:this.userData},e,t),n=u.state,o=u.scope,r=u.userData,this.currentState=n,this.store=o,this.userData=r},ve.userData={},ve.store={},ve.currentState=fe.start,ve=ve.bind(ve),K=function(e,t,o,n,r){return"toggleMuteMusic"===o&&(e.musicIsPaused?$():z(),e.musicIsPaused=!e.musicIsPaused),"toggleMuteSFX"===o&&(e.SFXIsPaused?ee():_(),e.SFXIsPaused=!e.SFXIsPaused),"getHelp"===o&&(e.showHelp=!e.showHelp),"cancel"===o&&e.showHelp&&(e.showHelp=!e.showHelp),"loggedIn"===o&&(t=fe.loadingUser,q(r)),[e,t,r]},y=function(e){var t,o,n;return o=s(e.lastSolvedBundleIndex,e.lastSolvedQuoteIndex),t=l[o.bundleIndex][o.quoteIndex].quote,n=l[o.bundleIndex][o.quoteIndex].source,setTimeout(function(){return ve("quoteLoaded",{message:t,source:n,bundleIndex:o.bundleIndex,quoteIndex:o.quoteIndex})},0)},j=function(e){var t;return(8===(t=e.keyCode)||32===t||9===t||37===t||38===t||39===t||40===t)&&e.preventDefault(),ve("keyPress",e)},U=function(e){return e.preventDefault(),ve("giveUp",null)},V=function(e){return e.preventDefault(),ve("hint",null)},J=function(e){return e.preventDefault(),ve("toggleMuteMusic",null)},X=function(e){return e.preventDefault(),ve("toggleMuteSFX",null)},W=function(e){return e.preventDefault(),ve("getHelp",null)},F=function(e){return e.preventDefault(),ve("cancel",null)},G=function(e){return e.preventDefault(),ve("confirm",null)},Y=function(){return ve("loggedIn",null)},h=function(e){var t,o;return o=R.invertObj(m),t=function(e,t){var n,r,s;return L(t["char"])?(n="",/[\n\r]/.test(t["char"])&&(n="<br>"),e+("</span>"+n+"<span class='word'>")):(s=t["char"],t.status===m.HIDDEN&&(s=" "),r=o[t.status].toLowerCase(),e+("<span class='letter "+r+"'>"+s+"</span>"))},R.reduce(t,"<span class='word'>",e)+"</span>"},ne=function(e,t,o){var n,s,a,i,c,d,p,g,f,m,v,y,b,w,x,k,R,S,D,E,q,H,P,M,Z,C,B,L,T;return d=Zepto("#secret-message"),p=Zepto("#source"),n=Zepto("#feedback"),s=Zepto("#feedback #message"),c=Zepto("#score"),a=Zepto("#mute-music-button"),i=Zepto("#mute-sfx-button"),C=e.secretMessage,L=e.source,m=e.feedback,Z=e.score,B=e.showPlayActions,x=e.match,f=e.buyHints,v=e.giveUp,y=e.giveUpCost,d.html(h(C)),s.html(m),c.text(Z),n.removeClass("no-match"),n.removeClass("match"),x===!0&&n.addClass("match"),x===!1&&n.addClass("no-match"),p.hide(),(e.solved||e.gaveUp)&&(p.show(),p.text(L||"Unknown")),e.showLogInLink?Zepto("#feedback .login-link").show():Zepto("#feedback .login-link").hide(),e.solved?Zepto("#share").show():Zepto("#share").hide(),B?Zepto("#play-actions").show():Zepto("#play-actions").hide(),Zepto("#hint-button .hints-remaining").text(o.hintsRemaining),a.removeClass("muted"),i.removeClass("muted"),t.musicIsPaused&&a.addClass("muted"),t.SFXIsPaused&&i.addClass("muted"),Zepto("#dialog").hide(),f&&(Zepto("#dialog #cancel").hide(),Zepto("#dialog #confirm").show(),S=I(o.totalScore),P=I(o.totalScore)-o.totalScore,Zepto("#dialog").show(),Zepto("#dialog h3").text("You are out of hints!"),Zepto("#dialog #message-content").html("Next free hint awarded at "+S+" points ("+P+" points to go)"),Zepto("#dialog #confirm").text("OK")),v&&(Zepto("#dialog #cancel").show(),Zepto("#dialog #confirm").show(),Zepto("#dialog").show(),Zepto("#dialog h3").text("Are you sure you want to give up?"),Zepto("#dialog #message-content").html("You will lose "+y+" points for the remaining unsolved words."),Zepto("#dialog #confirm").text("Yes, give up"),Zepto("#dialog #cancel").text("No, I'll keep trying")),e.noMoreQuotes&&(Zepto("#dialog #cancel").hide(),Zepto("#dialog #confirm").show(),Zepto("#dialog").show(),Zepto("#dialog h3").text("You solved all of the quotes!"),Zepto("#dialog #message-content").html("<p>Thank you for playing. Check back for more quote bundles. If you enjoyed playing, please tell a friend!</p>"),Zepto("#dialog #confirm").text("Play again?")),g=r[t.currentBundleIndex||0],R=r[(t.currentBundleIndex||0)+1],e.bundleCompleted&&(Zepto("#dialog #cancel").hide(),Zepto("#dialog #confirm").show(),Zepto("#dialog").show(),Zepto("#dialog h3").text('Congratulations, you finished the "'+g+'" bundle!'),Zepto("#dialog #message-content").html("You've unlocked the \""+R+'" bundle.'),Zepto("#dialog #confirm").text("Play next bundle")),t.showHelp&&(Zepto("#dialog #cancel").show(),Zepto("#dialog #confirm").hide(),Zepto("#dialog").show(),Zepto("#dialog h3").text("Help"),Zepto("#dialog #message-content").html("<p>Stuck?  You must reveal the secret message one letter at a time, from the start of each word.  Solving each word will give you a clue to which letters other words start with.  Try going for shorter word first.  The words stay solved only when you complete them.  You can always use a hint or give up, but it will cost you.  Good luck!</p>\n<h3>Credits</h3>\n<ul>\n  <li>Game designed and built by <a target='_blank' href='http://codeperfectionist.com/about'>Jeff Schomay</a></li>\n  <li>Music by Jamison Rivera\n  <li>Owl character by <a target='_blank' href='http://sherony.com'>Sherony Lock</a></li>\n  <li>Sound effects by <a target='_blank' href='https://www.freesound.org/people/ddohler/sounds/9098/'>ddohler</a>,\n  <a target='_blank' href='https://www.freesound.org/people/Horn/sounds/9744/'>Horn</a>,\n  <a target='_blank' href='https://www.freesound.org/people/NHumphrey/sounds/204466/'>NHumphrey</a>, and\n  <a target='_blank' href='https://www.freesound.org/people/lonemonk/sounds/47048/'>lonemonk</a></li>\n  <li>Special thanks to: Mark, Marcus, Zia, David, Joey, Molly and Michele</li>\n</ul>"),Zepto("#dialog #cancel").text("Keep playing")),D=(t.currentQuoteIndex||0)+1,g=r[t.currentBundleIndex||0],T=l[t.currentBundleIndex||0].length,Zepto("#user-info").show(),Zepto("#progress").html('Bundle: "'+g+'"<br>#'+D+" out of "+T),Zepto("#total-score").text(o.totalScore),(null!=u?u.services.isGuest():void 0)?Zepto("#user-info .login-link").show():Zepto("#user-info .login-link").hide(),q=Zepto("#owl").width(),b=200,H=window.innerWidth-b-q,M=e.progress||0,E=H*M+b/2,w=15,k=function(e,t){return Zepto("#owl").css({"-webkit-transform":"translate3d("+e+"px, -"+t+"px, 0)","-ms-transform":"translate3d("+e+"px, -"+t+"px, 0)",transform:"translate3d("+e+"px, -"+t+"px, 0)"})},e.solved?k(window.innerWidth-(q+10),70):k(E,w),setTimeout(function(){return e.solved?void 0:k(E,0)},70)},A=function(e){return R.length(R.filter(R.compose(R.identity,R.prop("_loaded")),R.values(e)))},ye=function(e,t){return A(t)===e?he():void 0},Q=function(e){var o,n,r,s;return s=R.length(R.keys(e)),o=[".ogg",".m4a",".wav"],n=function(e){return R.map(R.concat(e),o)},r=function(e,t){var o;return o=function(){return"string"==typeof t[1]?{urls:n(t[1]),onload:function(){return ye(s,e)}}:R.merge(t[1][1],{urls:n(t[1][0]),onload:function(){return ye(s,e)}})},e[t[0]]=new Howl(o()),e},R.reduce(r,t,R.toPairs(e))},N=function(e){var t,o;return o=function(e){var t;return t=new Image,t.src=e,t},(t=R.map(o))(e)},oe=function(){var e;return e=N(["assets/owl-normal.png","assets/owl-happy.png","assets/owl-sad.png","assets/owl-blink.png"]),Q({keyPressMiss:"assets/key-press-miss",keyPressHit:["assets/key-press-hit",{volume:o.keyPressHit}],giveUp:"assets/give-up",solved:"assets/solved",backgroundMusic:["assets/background-music-long",{volume:o.backgroundMusic,onend:function(){return this.play()}}]})},pe=function(e){return Zepto("body").removeClass(),Zepto("body").addClass(e)},ge=function(){var e,t;return t=function(){return Zepto("#owl").toggleClass("blink")},e=function(){return t(),setTimeout(t,200),setTimeout(e,8e3+5e3*(Math.random()-.5))},setTimeout(e,5e3),setTimeout(e,7e3)},he=function(){return Zepto(function(e){return v(),e(".popup").click(function(){var t,o,n,r,s,u,a;return a=575,t=400,o=(e(window).width()-a)/2,s=(e(window).height()-t)/2,u=this.href,n="status=1,width="+a+",height="+t+",top="+s+",left="+o,window.open(u,"Share",n),r=/twitter/.test(this.href)?"tweet":"facebook",d(r),!1}),e(document).on("keydown",j),e("#give-up-button").on("click",U),e("#hint-button").on("click",V),e("#mute-music-button").on("click",J),e("#mute-sfx-button").on("click",X),e("#help-button").on("click",W),e("#cancel").on("click",F),e("#confirm").on("click",G),e(".login-link").on("click",function(){return null!=u?u.services.showSignInBox():void 0}),null!=u&&u.services.addEventListener("login",Y),ge(),ve("gameReady")})},q=function(t){var o,n,r;return o={hintsRemaining:e.startingHints,totalScore:0,lastSolvedBundleIndex:void 0,lastSolvedQuoteIndex:void 0,progressPerBundle:void 0},n=R.values(t).length,r=n?t:o,i.load().then(function(e){var t,o;return e?(t=e.toJSON(),o=t.plays||0,t.plays=o+1,ue(t),ve("userLoaded",R.merge(r,t))):(ue(r),ve("userLoaded",r))},function(e){return console.error("Error loading user data:",e),ve("userLoaded",r)})},ue=function(e){return i.save(e)},oe()}}),require.register("src/persist",function(e,t,o){var n,r,s,u;s=parent.kongregate,Parse.initialize("iul0cVOM5mJWAj1HHBa158cpMoyEQ2wWxSK3Go9O","pbFnYPVaSunEmgjI8qTKqkW8nHKoB6Xor1DtOWpD"),r=function(){var e,t;return e=!1,s?s.services.isGuest()?void 0:t=s.services.getUserId():e?"mockUser":void 0},n=Parse.Object.extend("KongregatePlayer"),u=void 0,o.exports={save:function(e){var t;return(t=r())?u?u.save(e).then(function(){return!0},function(e){return console.error(e)}):(u=new n,u.set("userId",""+t),u.save(e).then(function(){return!0},function(e){return console.error(e)})):void 0},load:function(){var e,t,o,s;return s=r(),s?(o=new Parse.Query(n),o.equalTo("userId",""+s),t=o.first(),t.then(function(e){return e?u=e:void 0},function(e){return console.error(e)}),t):(e=new Parse.Promise,setTimeout(function(){return e.resolve()},0),e)}}}),require.register("src/stats",function(e,t,o){var n,r;r=parent.kongregate||{stats:{submit:console.log.bind(console)}},n=t("./bundles").bundleCompleted,o.exports=function(e){var t,o,s;return r.stats.submit("HighScore",e.totalScore),s=function(e,t){return e+t+1},o=R.reduce(s,0,e.progressPerBundle),r.stats.submit("NumCompletedQuotes",o),t=n(e.lastSolvedBundleIndex,e.lastSolvedQuoteIndex),t&&2===e.progressPerBundle.length&&r.stats.submit("Quotes2BundleCompleted",1),t&&1===e.progressPerBundle.length?r.stats.submit("StarterBundleComplete",1):void 0}});