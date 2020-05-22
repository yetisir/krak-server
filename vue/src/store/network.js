import vtkWSLinkClient from 'vtk.js/Sources/IO/Core/WSLinkClient';
import SmartConnect from 'wslink/src/SmartConnect';

import coneProtocol from '@/io/protocol';

import jQuery from 'jquery';

// Bind vtkWSLinkClient to our SmartConnect
vtkWSLinkClient.setSmartConnectClass(SmartConnect);

export default {
  state: {
    client: null,
    config: null,
    ssh_sock: null,
  },
  getters: {
    NETWORK_CLIENT(state) {
      return state.client;
    },
    NETWORK_CONFIG(state) {
      return state.config;
    },
    SSH_SOCK(state) {
      return state.config;
    },
  },
  mutations: {
    NETWORK_CLIENT_SET(state, client) {
      state.client = client;
    },
    NETWORK_CONFIG_SET(state, config) {
      state.config = config;
    },
    SSH_SOCK_SET(state, sock) {
      state.ssh_sock = sock;
    },
  },
  actions: {
    SSH_CONNECT({ commit, state }) {
      function ajax_complete_callback(resp) {
        if (resp.status !== 200) {
          log_status(resp.status + ': ' + resp.statusText, true);
          state = DISCONNECTED;
          return;
        }

        var msg = resp.responseJSON;
        if (!msg.id) {
          log_status(msg.status, true);
          state = DISCONNECTED;
          return;
        }
        var url = 'ws://0.0.0.0:8888/ws?id=' + msg.id;
        commit('SSH_SOCK_SET', new window.WebSocket(url));
        console.log(url);
        console.log('connected ...*');
        // encoding = 'utf-8',
        // decoder = window.TextDecoder
        //   ? new window.TextDecoder(encoding)
        //   : encoding,
        // terminal = document.getElementById('terminal'),
        // term = new window.Terminal({
        //   cursorBlink: true,
        //   theme: {
        //     background: url_opts_data.bgcolor || 'black',
        // },
        // });
      }

      jQuery.ajax({
        url: 'http://0.0.0.0:8888',
        type: 'post',
        complete: ajax_complete_callback,
        data: {
          hostname: '0.0.0.0',
          port: '22',
          username: 'yeti',
          password: 'Feldspar.!',
          privatekey: '',
          passphrase: '',
          totp: '',
          term: 'xterm-256color',
        },
      });
    },

    NETWORK_CONNECT({ commit, state }) {
      const { config, client } = state;
      if (client && client.isConnected()) {
        client.disconnect();
      }
      let clientToConnect = client;
      if (!clientToConnect) {
        clientToConnect = vtkWSLinkClient.newInstance();
        clientToConnect.setProtocols({
          Cone: coneProtocol,
        });
      }

      // Connect to busy store
      clientToConnect.onBusyChange((count) => {
        commit('BUSY_COUNT_SET', count);
      });
      clientToConnect.beginBusy();

      // Error
      clientToConnect.onConnectionError((httpReq) => {
        const message =
          (httpReq && httpReq.response && httpReq.response.error) ||
          `Connection error`;
        console.error(message);
        console.log(httpReq);
      });

      // Close
      clientToConnect.onConnectionClose((httpReq) => {
        const message =
          (httpReq && httpReq.response && httpReq.response.error) ||
          `Connection close`;
        console.error(message);
        console.log(httpReq);
      });

      // Connect
      clientToConnect
        .connect(config)
        .then((validClient) => {
          commit('NETWORK_CLIENT_SET', validClient);
          clientToConnect.endBusy();
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
};
