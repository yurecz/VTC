

test(function() {
  assert_throws({name: 'InvalidModificationError'}, function() {
    div.animate([{height: '100px', offset: 0.5}, {height: '200px', offset: 0}, {height: '300px', offset: 1}], 1);
  }, 'Out-of-order properties should not work');

  assert_throws({name: 'InvalidModificationError'}, function() {
    div.animate([{height: '100px', offset: 0.5}, {height: '150px'},
                 {height: '200px', offset: 0}, {height: '300px', offset: 1}], 1);
  }, 'Auto offsets combined with out-of-order properties should not work');
},
'Out-of-order Keyframe tests',
{
  help:   'http://dev.w3.org/fxtf/web-animations/#normalizing-a-sequence-of-keyframes',
  assert: 'Keyframes with out-of-order offsets should work, unless there are also auto offsets',
  author: 'Shane Stephens'
});

