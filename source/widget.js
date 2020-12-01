// Code used/influenced by Coocla33's Advanced Information Bar

let settings = {
  "rotator": {
    "refresh_interval": 8, // Seconds
  	"color_primary": "#2200FF",
    "color_secondary": "#FFE4A8",
    "font_primary": "#FFE4A8",
  	"font_secondary": "#2200FF",
  }
}

let state = {
  "latest": {
    "follower": {
      "enabled": false,
      "name": "",
      "icon": "fa fa-heart fa-lg",
      "empty": ""
    },
    // "subscriber": {
    //   "enabled": true,
    //   "name": "",
    //   "amount": 0,
    //   "icon": "person",
    //   "empty": ""
    // },
    "tip": {
      "enabled": false,
      "name": "",
      "amount": 0,
      "icon": "fa fa-usd fa-lg",
      "empty": ""
    },
    "cheer": {
      "enabled": false,
      "name": "",
      "amount": 0,
      "icon": "fa fa-diamond fa-lg",
      "empty": ""
    },
    "host": {
      "enabled": false,
      "name": "",
      "amount": 0,
      "icon": "fa fa-television fa-lg",
      "empty": ""
    },
    "raid": {
      "enabled": false,
      "name": "",
      "amount": 0,
      "icon": "fa fa-group fa-lg",
      "empty": ""
    },
  }
}

// Alert Variables
let alert_queue = [];
let alert_active = false;
let alert_timeline = gsap.timeline();

// Add Alert
function addAlert(type, username, amount) {
  // Add item to alert_queue
  alert_queue.push({type, username, amount});

  // Play alert
  playAlert()
}

// Play Alert
function playAlert() {
  // Check if queue is not empty
  if (alert_queue.length > 0 && alert_active == false) {
    // Get current item
    let current_item = alert_queue[0];

    // Remove current item from alert_queue
    alert_queue.shift();

    // Set alert active
    alert_active = true;

    // Generate HTML
    let text_html;
    let icon_html = `
      <i class="${state.latest[current_item.type].icon}">
    `;

    switch (current_item.type) {
      case "follower":
        text_html = `
        <span>${current_item.username}</span>
        `;
        break;
      // case "subscriber-latest":
      //   break;
      // case "host":
      //   text_html = `
      //   <span>${current_item.username} x${current_item.amount}</span>
      //   `;
      //   break;
      // case "cheer":
      //   text_html = `
      //   <span>${current_item.username} x${current_item.amount}</span>
      //   `;
      //   break;
      // case "tip":
      //   text_html = `
      //   <span>${current_item.username} x${current_item.amount}</span>
      //   `;
      //   break;
      // case "raid":
      //   text_html = `
      //   <span>${current_item.username} x${current_item.amount}</span>
      //   `;
      //   break;
    
      default:
        text_html = `
        <span>${current_item.username} x${current_item.amount}</span>
        `;
        break;
    }

    // Set initial states
    gsap.set('.main-container', {
      backgroundColor: `${settings.rotator.color_secondary}`
    });

    gsap.set('.info-container', {
      color: `${settings.rotator.font_secondary}`
    });

    // Animate In
    alert_timeline.to('.main-container', {
      backgroundColor: `${settings.rotator.color_primary}`,
      duration: 3,
      ease: 'expo.out'
    });

    alert_timeline.to('.info-container', {
      color: `${settings.rotator.font_primary}`,
      duration: 3,
      ease: 'expo.out',
      onStart: function() {
        // Apply alert html
        $('.text').html(text_html);
        $('.icon').html(icon_html);
      }
    }, '-=2');

    // Animate Out
    alert_timeline.to('.main-container', {
      delay: 1,
      backgroundColor: `${settings.rotator.color_secondary}`,
      duration: 3,
      ease: 'expo.out'
    }, '+=3');

    alert_timeline.to('.info-container', {
      color: `${settings.rotator.font_secondary}`,
      duration: 3,
      ease: 'expo.out',
      onComplete: function() {
        // Set alert to inactive
        alert_active = false;

        // Play animation
        playAlert();
      }
    }, '-=3');
  }
}

let latest_iterator = 0;
let latest_keys;

function startRotator() {
  // Populate latest_keys
  latest_keys = Object.keys(state.latest);
  
  // Start refresh interval
  setInterval(() => {
    if (!alert_active) {
      // Latest
      // Variables
      let latestObject = state.latest[latest_keys[latest_iterator]];
      let latestType = latest_keys[latest_iterator];

      // fadeOut Current
      $(".icon, .text").fadeOut(function() {
        // Generate html
        let html_icon = '';
        html_icon += `
        <i class='${latestObject.icon}'></i>
        `;

        let html_text = '';
        html_text += `
        <span>`;

        // Check if empty
        if (latestObject.name == "") {
          html_text += `${latestObject.empty}`;
          // html_text += "Empty text";
        } else {
          // Check type
          switch (latestType) {
            case "follower":
              html_text += `${latestObject.name}`;
              break;
            // case "subscriber-latest":
            //   break;
            // case "host":
            //   html_text += `
            //   <span>${latestObject.name} x${current_item.amount}</span>
            //   `;
            //   break;
            // case "cheer":
            //   html_text += `
            //   <span>${latestObject.name} x${current_item.amount}</span>
            //   `;
            //   break;
            // case "tip":
            //   html_text += `
            //   <span>${latestObject.name} x${current_item.amount}</span>
            //   `;
            //   break;
            // case "raid":
            //   html_text += `
            //   <span>${latestObject.name} x${current_item.amount}</span>
            //   `;
            //   break;
          
            default:
              html_text += `${latestObject.name} x${latestObject.amount}`;
              break;
          }
        }

        html_text += "</span>";

        // Update
        $('.icon').html(html_icon);
        $('.text').html(html_text);
        // Fade in
        $(".icon, .text").fadeIn();

        latest_iterator++;
        if (latest_iterator == latest_keys.length) {
          latest_iterator = 0;
        }
      });
    }
  }, settings.rotator.refresh_interval * 1000);
}

// On widget load, setup settings/state etc
window.addEventListener('onWidgetLoad', function(obj) {
  console.log('ON WIDGET LOAD')
  console.log(obj)
  
  let fieldData = obj.detail.fieldData;
  
  settings.rotator.refresh_interval = fieldData.rotatorInterval;
  settings.rotator.color_primary = fieldData.colorPrimary;
  settings.rotator.color_secondary = fieldData.colorSecondary;
  settings.rotator.font_primary = fieldData.fontColorPrimary;
  settings.rotator.font_secondary = fieldData.fontColorSecondary;
  settings.rotator.font_size = fieldData.fontSize;
  settings.rotator.bar_width = fieldData.barWidth;
  settings.rotator.rotator_padding_left = fieldData.rotatorPaddingLeft;
  
  // Latest
  if (fieldData.latestFollowerToggle == "true") {
    state.latest.follower.empty = fieldData.latestFollowerEmpty;
    state.latest.follower.enabled = true;
    // state.latest.follower.icon = fieldData.followers_icon;
    
    if (obj.detail.session.data["follower-latest"].name != "") {
      state.latest.follower.name = obj.detail.session.data["follower-latest"].name;
    }
  } else {
    delete state.latest.follower;
  }
  if (fieldData.latestSubscriberToggle == "true") {
    state.latest.subscriber.empty = fieldData.latestSubscriberEmpty;
    state.latest.subscriber.enabled = true;
    // state.latest.subscriber.icon = fieldData.subs_icon;
  
    if (obj.detail.session.data["subscriber-latest"].name != "") {
      state.latest.subscriber.name = obj.detail.session.data["subscriber-latest"].name;
      state.latest.subscriber.amount = obj.detail.session.data["subscriber-latest"].amount;
    }
  } else {
    delete state.latest.subscriber;
  }
  if (fieldData.latestTipToggle == "true") {
    state.latest.tip.empty = fieldData.latestTipEmpty;
    state.latest.tip.enabled = true;
    // state.latest.tip.icon = fieldData.tip_icon;
  
    if (obj.detail.session.data["tip-latest"].name != "") {
      state.latest.tip.name = obj.detail.session.data["tip-latest"].name;
      state.latest.tip.amount = obj.detail.session.data["tip-latest"].amount;
    }
  } else {
    delete state.latest.tip;
  }
  if (fieldData.latestCheerToggle == "true") {
    state.latest.cheer.empty = fieldData.latestCheerEmpty;
    state.latest.cheer.enabled = true;
    // state.latest.cheer.icon = fieldData.cheer_icon;
  
    if (obj.detail.session.data["cheer-latest"].name != "") {
      state.latest.cheer.name = obj.detail.session.data["cheer-latest"].name;
      state.latest.cheer.amount = obj.detail.session.data["cheer-latest"].amount;
    }
  } else {
    delete state.latest.cheer;
  }
  if (fieldData.latestHostToggle == "true") {
    state.latest.host.empty = fieldData.latestHostEmpty;
    state.latest.host.enabled = true;
    // state.latest.host.icon = fieldData.host_icon;
  
    if (obj.detail.session.data["host-latest"].name != "") {
      state.latest.host.name = obj.detail.session.data["host-latest"].name;
      state.latest.host.amount = obj.detail.session.data["host-latest"].amount;
    }
  } else {
    delete state.latest.host;
  }
  if (fieldData.latestRaidToggle == "true") {
    state.latest.raid.empty = fieldData.latestRaidEmpty;
    state.latest.raid.enabled = true;
    // state.latest.raid.icon = fieldData.raid_icon;
  
    if (obj.detail.session.data["raid-latest"].name != "") {
      state.latest.raid.name = obj.detail.session.data["raid-latest"].name;
      state.latest.raid.amount = obj.detail.session.data["raid-latest"].amount;
    }
  } else {
    delete state.latest.raid;
  }
  
  startRotator();
});

// On new event received
window.addEventListener('onEventReceived', function(obj) {
  const listener = obj.detail.listener;
  const data = obj["detail"]["event"];

  switch (listener) {
    case "follower-latest":
      state.latest.follower.name = data["name"];
      addAlert("follower", data["name"]);
      break;
    // case "subscriber-latest":
    //   state.latest.subscriber = data["name"];
    //   break;
    case "host-latest":
      addAlert("host", data["name"], data["amount"]);
      break;
    case "cheer-latest":
      state.latest.cheer.name = data["name"];
      state.latest.cheer.amount = data["amount"];
      addAlert("cheer", data["name"], data["amount"]);
      break;
    case "tip-latest":
      state.latest.tip.name = data["name"];
      state.latest.tip.amount = data["amount"].toFixed(2);
      addAlert("tip", data["name"], data["amount"].toFixed(2));
      break;
    case "raid-latest":
      addAlert("raid", data["name"], data["amount"]);
      break;
  
    default:
      break;
  }
});