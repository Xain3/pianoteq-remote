# Pianoteq API coverage

The runtime's own API reference is the best source for its installed version:
start Pianoteq with `--serve 127.0.0.1:8081` and open `http://127.0.0.1:8081/jsonrpc`.

This scaffold has not yet been verified against a live Pianoteq 9 installation.
The tests use representative response fixtures and an explicit demo provider.

| Method                  | Purpose                                      | Adapter use                                         |
| ----------------------- | -------------------------------------------- | --------------------------------------------------- |
| `getInfo`               | Product/version and current preset           | Accepts singleton array or object                   |
| `getListOfPresets`      | Preset catalog                               | Uses name + bank as identity; caches for 15 seconds |
| `loadPreset`            | Switch instrument/preset                     | Sends name, bank and `preset_type: full`            |
| `getParameters`         | Discover instrument parameters               | Resolves volume by normalized ID                    |
| `setParameters`         | Write supported parameter                    | Sends discovered original ID and `normalized_value` |
| `getAudioDeviceInfo`    | Read current audio driver/output/rate/buffer | Accepts numeric strings and missing settings        |
| `getListOfAudioDevices` | Read available audio outputs by driver       | Read only                                           |

No MIDI device enumeration or hardware-device write method is assumed. The I/O screen
shows audio information and clearly disabled device selectors. PATCH device endpoints
return HTTP 501. The gateway interface is the extension point when a supported method
or platform adapter becomes available; editing active preference files is not implemented.

Pianoteq 9 changed parameter IDs to lowercase with punctuation replaced by underscores.
Matching is normalized, but writes always use the original ID returned by the host.
Volume's 0..1 normalized value is not assumed to be a linear gain or decibel scale.

References:

- [Modartt: JSON-RPC reference access](https://forum.modartt.com/viewtopic.php?id=9043)
- [Modartt: Pianoteq 9 ID change, including administrator explanation](https://forum.modartt.com/viewtopic.php?id=12668)
- [Web client author: hardware switching limitations](https://forum.modartt.com/viewtopic.php?id=9104)
- [Observed audio response shapes](https://forum.modartt.com/viewtopic.php?id=12625)
