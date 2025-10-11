<script lang="ts">
  import { animate } from "animejs";
  import type { TransitionConfig } from "svelte/transition";

  let todoLength = $state(0);

  function animeTransition(
    node: HTMLElement,
    params: { duration?: number },
    _options: { direction: "in" | "out" | "both" },
  ): TransitionConfig {
    const duration = params.duration || 1000;
    const animation = animate(node, {
      opacity: [0, 1],
      x: [100, 0],
      autoplay: false,
      duration,
    });

    return {
      duration,
      tick(t, u) {
        animation.seek(t * duration);
      },
    };
  }
</script>

<div>
  <div class="flex items-center gap-3 mb-4">
    <button class="p-2" onclick={() => (todoLength += 1)}>Add Todo</button>
    <button class="p-2" onclick={() => (todoLength -= 1)}> Remove Todo </button>
    <button class="p-2" onclick={() => (todoLength = 0)}> Clear Todos </button>
  </div>
  <ul class="h-[200px]">
    {#each { length: todoLength } as _, idx (idx)}
      <li transition:animeTransition={{ duration: 300 }}>
        Todo {idx + 1}
      </li>
    {/each}
  </ul>
</div>
